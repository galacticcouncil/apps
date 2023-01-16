import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

const GRAFANA_DS = 'https://grafana-api.play.hydration.cloud/api/ds/query';

const tradesQuery = `select timestamp, 
  block.height as block,
  args->>'who' as who,
  name as operation,
  (args->>'assetIn')::integer as asset_in,
  (args->>'assetOut')::integer as asset_out,
  (args->>'amountIn')::numeric as amount_in,
  (args->>'amountOut')::numeric as amount_out 
  from event inner join block on block_id = block.id
  where name like 'Omnipool.%Executed' 
  order by block_id asc`;

const normalizedTradesQuery = `select timestamp,
  block, 
  who,
  operation,
  (select symbol from token_metadata where id = asset_in limit 1) as asset_in,
  (select symbol from token_metadata where id = asset_out limit 1) as asset_out,
  amount_in / 10 ^ (select decimals from token_metadata where id = asset_in limit 1) as amount_in,
  amount_out / 10 ^ (select decimals from token_metadata where id = asset_out limit 1) as amount_out
  from (${tradesQuery}) as trades`;

const pairPriceQuery = `select
    timestamp AS "time",
    price
  from pair_price`;

const pairPriceQueryByHourGranularity = `select
    floor(extract(epoch from "timestamp")/1800)*1800 as "time",
    last(price) as "price"
  from pair_price
  `;

  const removeDups = `select
    timestamp AS "time",
    max(price) as "price"
  from pair_price
  `;

function aggregationQuery(granularity: string) {
  if (granularity == 'All') {
    return `${pairPriceQueryByHourGranularity} group by 1`;
  }
  return `${pairPriceQueryByHourGranularity} WHERE timestamp > now() - INTERVAL '${granularity || '24h'}' group by 1`;
}

function buildQuery(assetIn: string, assetOut: string, granularity: string) {
  return `with normalized_trades as (${normalizedTradesQuery}),
    pair_price as (select 
      timestamp,
      amount_in / amount_out as price
    from normalized_trades
    where asset_in = '${assetIn}' and asset_out = '${assetOut}' 
    union all
    select 
      timestamp,
      amount_out / amount_in as price
    from normalized_trades
    where asset_in = '${assetOut}' and asset_out = '${assetIn}' 
    order by timestamp)
    ${aggregationQuery(granularity)}
    order by 1`;
}

function buildQuery2(assetIn: string, assetOut: string) {
  return `with pair_price as (select 
    timestamp,
    amount_in / amount_out as price
   from normalized_trades
   where asset_in = '${assetIn}' and asset_out = '${assetOut}' 
   union all
   select 
    timestamp,
    amount_out / amount_in as price
   from normalized_trades
   where asset_in = '${assetOut}' and asset_out = '${assetIn}' 
   order by timestamp)
   ${removeDups} 
   WHERE
    "timestamp" BETWEEN '2023-01-06T22:05:49.000Z' AND '2023-01-15T23:59:00.000Z' 
   GROUP BY 1
   ORDER BY 1`;
}

export function formatData(ts: number[], price: number[]) {
  return ts.map((obj: number, index: number) => {
    return {
      time: Math.floor(obj / 1000) as UTCTimestamp,
      value: price[index],
    } as SingleValueData;
  });
}

export function query(
  datasourceId: number,
  assetIn: string,
  assetOut: string,
  onData: (ts: number[], price: number[]) => void
) {
  fetch(GRAFANA_DS, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      queries: [
        {
          refId: 'pool',
          rawSql: buildQuery2(assetIn, assetOut),
          format: 'table',
          datasourceId: datasourceId,
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const values = data.results.pool.frames[0].data.values;
      onData(values[0], values[1]);
    })
    .catch(function (res) {
      console.error(res);
    });
}
