export function getGradientDataset(ctx: CanvasRenderingContext2D, height: number): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(79, 223, 255, 0.31)');
  gradient.addColorStop(1, 'rgba(79, 234, 255, 0)');
  return gradient;
}
