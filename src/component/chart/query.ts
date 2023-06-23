export const INIT_DATE = '2023-01-06T13:00:00.000Z';

const priceQueryGroup = `SELECT
    $__timeGroupAlias("timestamp",'1h'),
    max(price) AS "price"
  FROM pair_price
  `;

const priceQuery = `SELECT
    timestamp AS "time",
    max(price) AS "price"
  FROM pair_price
  `;

export function buildPriceQuery(assetIn: string, assetOut: string, endOfDay: string) {
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
   ${priceQueryGroup} 
   WHERE
    "timestamp" BETWEEN '${INIT_DATE}' AND '${endOfDay}' 
   GROUP BY 1
   ORDER BY 1`;
}

const volumeQuery = `SELECT
    $__timeGroupAlias("timestamp",'1h'),
    sum(volume) AS "volume (hourly)"
  FROM volume
  `;

export function buildVolumeQuery(assetIn: string, assetOut: string, endOfDay: string) {
  return `WITH volume AS (SELECT 
    timestamp,
    amount_in AS volume
   FROM normalized_trades
   WHERE asset_in = '${assetIn}' AND asset_out = '${assetOut}' 
   AND "timestamp" BETWEEN '${INIT_DATE}' AND '${endOfDay}' 
   UNION ALL
   SELECT 
    timestamp,
    amount_out AS volume
   FROM normalized_trades
   WHERE asset_in = '${assetOut}' AND asset_out = '${assetIn}' 
   AND "timestamp" BETWEEN '${INIT_DATE}' AND '${endOfDay}' 
   ORDER BY timestamp)
   ${volumeQuery} 
   WHERE
    "timestamp" BETWEEN '${INIT_DATE}' AND '${endOfDay}' 
   GROUP BY 1
   ORDER BY 1`;
}
