import { humanizeAmount } from '../../utils/amount';
import { IChartApi, ISeriesApi, LineData, UTCTimestamp } from 'lightweight-charts';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function subscribeCrosshair(
  chart: IChartApi,
  chartContainer: HTMLElement,
  series: ISeriesApi<'Baseline'>,
  selected: HTMLElement,
  actual: HTMLElement,
  floating: HTMLElement,
  onPriceSelection: (price: string) => string
): void {
  chart.subscribeCrosshairMove(function (param) {
    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > chartContainer.clientWidth ||
      param.point.y < 0 ||
      param.point.y > chartContainer.clientHeight
    ) {
      selected.style.display = 'none';
      floating.style.display = 'none';
      actual.style.display = 'flex';
    } else {
      const asset = actual.getElementsByClassName('asset');
      const price = param.seriesData.get(series) as LineData;
      if (asset.length == 0 || !price) {
        selected.style.display = 'none';
        floating.style.display = 'none';
        actual.style.display = 'flex';
        return;
      }

      selected.style.display = 'flex';
      floating.style.display = 'flex';
      actual.style.display = 'none';

      const usdPrice = onPriceSelection(price.value.toString());
      const assetText = asset[0].textContent;
      const priceHtml = `<div class="price">` + humanizeAmount(price.value.toString()) + ` ${assetText}</div>`;
      const usdHtml = `<div class="usd"><span>` + `≈$${usdPrice}` + `</span></div>`;
      selected.innerHTML = usdPrice ? priceHtml + usdHtml : priceHtml;

      const date = dayjs
        .unix(param.time as UTCTimestamp)
        .utc()
        .format('MMM D, YYYY');
      const time = dayjs
        .unix(param.time as UTCTimestamp)
        .utc()
        .format('HH:mm');
      let left: any = param.point.x;

      floating.innerHTML = `<div>` + date + `</div>` + `<div class="time">` + time + `</div>`;

      const toolTipWidth = 96;
      const priceScaleWidth = 50;

      if (left < toolTipWidth / 2) {
        left = priceScaleWidth - toolTipWidth / 2;
      } else if (left < chartContainer.clientWidth - toolTipWidth / 2) {
        left = left - toolTipWidth / 2;
      } else {
        left = chartContainer.clientWidth - toolTipWidth;
      }

      floating.style.left = left + 'px';
      floating.style.top = 0 + 'px';
    }
  });
}
