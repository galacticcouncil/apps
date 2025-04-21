import { Asset } from '@galacticcouncil/sdk';
import { ChartRange } from 'element/chart/types';

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
    case ChartRange['1y']:
    default:
      return '24h';
  }
}

export function buildQuery(
  assetIn: Asset,
  assetOut: Asset,
  from: string,
  to: string,
  range: ChartRange,
) {
  const queryRange = getRange(range);
  return `
    WITH metadata_extended AS (
        select * from token_metadata
        union all select ${assetIn.id} as id, '${assetIn.symbol}' as symbol, ${assetIn.decimals} as decimals
        union all select ${assetOut.id} as id, '${assetOut.symbol}' as symbol, ${assetOut.decimals} as decimals
    ),
    filtered_trades AS (
        SELECT
            timestamp,
            (e.args->>'assetIn')::integer AS asset_in,
            (e.args->>'assetOut')::integer AS asset_out,
            (e.args->>'amountIn')::numeric AS amount_in_raw,
            (e.args->>'amountOut')::numeric AS amount_out_raw
        FROM event e
        INNER JOIN block b ON e.block_id = b.id
        INNER JOIN call c ON e.call_id = c.id
        WHERE 
            ((c.name != 'Router.buy' AND e.name = 'Router.RouteExecuted')
             OR e.name IN ('Omnipool.BuyExecuted', 'Omnipool.SellExecuted', 'Router.Executed'))
            AND timestamp BETWEEN '${from}' AND '${to}'
            AND (
                ((e.args->>'assetIn')::integer = ${assetOut.id} AND (e.args->>'assetOut')::integer = ${assetIn.id})
                OR 
                ((e.args->>'assetIn')::integer = ${assetIn.id} AND (e.args->>'assetOut')::integer = ${assetOut.id})
            )
    ),
    nor_trades AS (
        SELECT
            timestamp,
            asset_in,
            asset_out,
            amount_in_raw / (10 ^ token_metadata_in.decimals) AS amount_in,
            amount_out_raw / (10 ^ token_metadata_out.decimals) AS amount_out
        FROM filtered_trades
        INNER JOIN metadata_extended AS token_metadata_in ON asset_in = token_metadata_in.id
        INNER JOIN metadata_extended AS token_metadata_out ON asset_out = token_metadata_out.id
        WHERE amount_in_raw > 0 AND amount_out_raw > 0
    ),
    pair_price AS (
        SELECT 
            timestamp,
            CASE 
                WHEN asset_in = ${assetIn.id} AND asset_out = ${assetOut.id} AND amount_in != 0 AND amount_out != 0 THEN amount_in / amount_out
                WHEN asset_in = ${assetOut.id} AND asset_out = ${assetIn.id} AND amount_in != 0 AND amount_out != 0 THEN amount_out / amount_in
            END AS price,
            CASE
                WHEN asset_in = ${assetIn.id} THEN amount_in
                WHEN asset_in = ${assetOut.id} THEN amount_out
            END AS volume
        FROM nor_trades
    ),
    prev_price AS (
        SELECT
            *,
            lag(price) over (order by timestamp) as prev_price
        FROM pair_price
        WHERE price IS NOT NULL
    ),
    filtered_price AS (
        SELECT *
        FROM prev_price
        WHERE prev_price IS NULL
            OR (prev_price < price * 2 AND price < prev_price * 2)
    ),
    buckets AS (
      SELECT
        $__timeGroupAlias("timestamp",'${queryRange}'),
        avg(price) AS price,
        sum(volume) as volume
      FROM filtered_price
      GROUP BY 1
      ORDER BY 1
    )
    select time, price, volume 
    FROM buckets 
    where volume * 1000 > (select avg(volume) from buckets);
    `;
}
