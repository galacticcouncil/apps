import { ChartRange } from 'element/chart/types';

function getPriceQuery(range: string) {
  return `SELECT
    $__timeGroupAlias("timestamp",'${range}'),
    avg(price) AS "price",
    min(price) AS "low",
    max(price) AS "high",
    (array_agg(price ORDER BY timestamp ASC))[1] AS "open",
    (array_agg(price ORDER BY timestamp DESC))[1] AS "close"
    FROM pair_price
    WHERE price IS NOT NULL
    `;
}

function getVolumeQuery(range: string) {
  return `SELECT
    $__timeGroupAlias("timestamp",'${range}'),
    sum(volume) AS "volume"
    FROM pair_volume
    WHERE volume IS NOT NULL
    `;
}

function getRange(range: ChartRange) {
  switch (range) {
    case ChartRange['1h']:
      return '1m';
    case ChartRange['1d']:
      return '10m';
    case ChartRange['1w']:
      return '1h';
    case ChartRange['1m']:
      return '3h';
    default:
      return '24h';
  }
}

function buildQuery(
  assetIn: string,
  assetOut: string,
  from: string,
  to: string,
  range: ChartRange,
  selector: (range: string) => string,
) {
  const queryRange = getRange(range);
  return `
    WITH nor_trades AS (
      SELECT
        timestamp,
        block.height AS block,
        event.args->>'who' AS who,
        event.name AS operation,
        (event.args->>'assetIn')::integer AS asset_in,
        (event.args->>'assetOut')::integer AS asset_out,
        (event.args->>'amountIn')::numeric / (10 ^ token_metadata_in.decimals) AS amount_in,
        (event.args->>'amountOut')::numeric / (10 ^ token_metadata_out.decimals) AS amount_out
      FROM event
      INNER JOIN block ON block_id = block.id
      INNER JOIN call ON call_id = call.id
      INNER JOIN token_metadata AS token_metadata_in ON (event.args->>'assetIn')::integer = token_metadata_in.id
      INNER JOIN token_metadata AS token_metadata_out ON (event.args->>'assetOut')::integer = token_metadata_out.id
      WHERE ((call.name != 'Router.buy' AND event.name = 'Router.RouteExecuted')
        OR event.name IN ('Omnipool.BuyExecuted', 'Omnipool.SellExecuted', 'Router.Executed'))
        AND timestamp BETWEEN '${from}' AND '${to}'
    ),
    pair_price AS (
      SELECT 
        timestamp,
        CASE 
          WHEN asset_in = ${assetIn} AND asset_out = ${assetOut} AND amount_in != 0 AND amount_out != 0 THEN amount_in / amount_out
          WHEN asset_in = ${assetOut} AND asset_out = ${assetIn} AND amount_in != 0 AND amount_out != 0 THEN amount_out / amount_in
        END AS price
      FROM nor_trades
    ),
    pair_volume AS (
      SELECT 
        timestamp,
        CASE 
          WHEN asset_in = ${assetIn} AND asset_out = ${assetOut} THEN amount_in
          WHEN asset_in = ${assetOut} AND asset_out = ${assetIn} THEN amount_out
        END AS volume
      FROM nor_trades
    ),
    pair_volume_rev AS (
      SELECT 
        timestamp,
        CASE 
          WHEN asset_in = ${assetIn} AND asset_out = ${assetOut} THEN amount_out
          WHEN asset_in = ${assetOut} AND asset_out = ${assetIn} THEN amount_in
        END AS volume
      FROM nor_trades
    )
    ${selector(queryRange)}
    GROUP BY 1
    ORDER BY 1;
    `;
}

export function buildPriceQuery(
  assetIn: string,
  assetOut: string,
  from: string,
  to: string,
  range: ChartRange,
) {
  return buildQuery(assetIn, assetOut, from, to, range, getPriceQuery);
}

export function buildVolumeQuery(
  assetIn: string,
  assetOut: string,
  from: string,
  to: string,
  range: ChartRange,
) {
  return buildQuery(assetIn, assetOut, from, to, range, getVolumeQuery);
}
