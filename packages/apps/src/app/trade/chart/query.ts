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
    nor_trades AS (
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
      INNER JOIN metadata_extended AS token_metadata_in ON (event.args->>'assetIn')::integer = token_metadata_in.id
      INNER JOIN metadata_extended AS token_metadata_out ON (event.args->>'assetOut')::integer = token_metadata_out.id
      WHERE ((call.name != 'Router.buy' AND event.name = 'Router.RouteExecuted')
        OR event.name IN ('Omnipool.BuyExecuted', 'Omnipool.SellExecuted', 'Router.Executed'))
        AND timestamp BETWEEN '${from}' AND '${to}'
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
      from pair_price
      WHERE price IS NOT NULL
    ),
    filtered_price AS (
      select *
      FROM prev_price
      where prev_price IS NULL
         or (prev_price < price * 2 and price < prev_price * 2)
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
