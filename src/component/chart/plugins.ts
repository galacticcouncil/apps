import { humanizeAmount } from '../../utils/amount';

export const corsairPlugin = {
  id: 'corsair',
  defaults: {
    width: 1,
    color: '#66697C',
    dash: [4, 4],
  },
  afterInit: (chart, args, opts) => {
    chart.corsair = {
      x: 0,
      y: 0,
    };
  },
  afterEvent: (chart, args) => {
    const { inChartArea } = args;
    const { type, x, y } = args.event;

    chart.corsair = { x, y, draw: inChartArea };
    chart.draw();
  },
  afterDraw: (chart, args, opts) => {
    const { ctx } = chart;
    const { top, bottom, left, right } = chart.chartArea;
    const { x, y, draw } = chart.corsair;
    if (!draw) return;

    ctx.save();

    ctx.beginPath();
    ctx.lineWidth = opts.width;
    ctx.strokeStyle = opts.color;
    ctx.setLineDash(opts.dash);
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, top);
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();

    ctx.restore();
  },
};

export function tooltipLabel(context) {
  let label = context.dataset.label || '';

  if (label) {
    label += ': ';
  }
  if (context.parsed.y !== null) {
    return humanizeAmount(context.parsed.y);
  }
  return label;
}

export function tooltipLabelTextColor(context) {
  return '#85D1FF';
}

export function tooltipLabelPointStyle(context) {
  return {
    pointStyle: 'line',
    rotation: 0,
  };
}
