import { SingleValueData, UTCTimestamp } from 'lightweight-charts';

const GRAFANA_DS = 'https://grafana-api.play.hydration.cloud/api/ds/query';

const dedupQuery = `SELECT
    timestamp AS "time",
    max(price) AS "price"
  FROM pair_price
  `;

function buildQuery(assetIn: string, assetOut: string, endOfDay: string) {
  return `WITH pair_price AS (SELECT 
    timestamp,
    amount_in / amount_out AS price
   FROM normalized_trades
   WHERE asset_in = '${assetIn}' AND asset_out = '${assetOut}' 
   UNION ALL
   SELECT 
    timestamp,
    amount_out / amount_in AS price
   FROM normalized_trades
   WHERE asset_in = '${assetOut}' AND asset_out = '${assetIn}' 
   ORDER BY timestamp)
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
  onSuccess: (ts: number[], price: number[]) => void,
  onError: (error: any) => void
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
      onSuccess(values[0], values[1]);
    })
    .catch(function (res) {
      console.error(res);
      onError(res);
    });
}
