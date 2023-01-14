import { ChartData } from 'chart.js';
import { getGradientDataset } from './utils';

export function dataset(labels: number[], data: number[]): ChartData {
  return {
    labels: labels,
    datasets: [
      {
        type: 'line',
        fill: true,
        label: 'Price',
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          return getGradientDataset(ctx, chartArea.height);
        },
        tension: 0.1,
        //cubicInterpolationMode: "monotone",
        borderColor: '#85D1FF',
        data: data,
        borderWidth: 2,
        pointRadius: 0,
        pointBackgroundColor: function (context) {
          return '#fff';
        },
      },
    ],
  } as ChartData;
}

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
    floor(extract(epoch from "timestamp")/60)*60 as "time",
    last(price) as "price"
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

export function query(
  granularity: string,
  assetIn: string,
  assetOut: string,
  datasourceId: number,
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
          rawSql: buildQuery(assetIn, assetOut, granularity),
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
