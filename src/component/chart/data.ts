import { ChartData } from 'chart.js';
import { getGradientDataset } from './utils';

export const dataset = (labels: number[], data: number[]) => {
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
        borderColor: '#85D1FF',
        data: data,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  } as ChartData;
};

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

const finalQuery = `select
 date_trunc( 'hour', timestamp ),
 max(amount_out / amount_in) as price
 from (${normalizedTradesQuery}) as normalized_trades
 where asset_in = 'HDX' and asset_out = 'DAI' and timestamp > now() - INTERVAL '24 hours'
 group by 1`;

const finalQuery2 = `select
 timestamp,
 amount_out / amount_in as price
 from (${normalizedTradesQuery}) as normalized_trades
 where asset_in = 'HDX' and asset_out = 'DAI' and timestamp > now() - INTERVAL '7 days'`;

export function query(onData: (ts: number[], price: number[]) => void) {
  fetch('https://grafana-api.play.hydration.cloud/api/ds/query', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      queries: [
        {
          refId: 'omni',
          rawSql: finalQuery2,
          format: 'table',
          datasourceId: 10,
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const values = data.results.omni.frames[0].data.values;
      onData(values[0], values[1]);
    })
    .catch(function (res) {
      console.log(res);
    });
}
