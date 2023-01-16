import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

const GRAFANA_DS = 'https://grafana-api.play.hydration.cloud/api/ds/query';

const dedupQuery = `SELECT
    timestamp AS "time",
    max(price) as "price"
  FROM pair_price
  `;

function buildQuery(assetIn: string, assetOut: string, endOfDay: string) {
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
   ${dedupQuery} 
   WHERE
    "timestamp" BETWEEN '2023-01-06T22:05:49.000Z' AND '${endOfDay}' 
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
  endOfDay: string,
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
          rawSql: buildQuery(assetIn, assetOut, endOfDay),
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
