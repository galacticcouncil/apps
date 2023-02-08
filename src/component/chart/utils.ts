const MAX_PAPER_WIDTH = 480;

export function calculateWidth(entry: ResizeObserverEntry): number {
  const crv = entry.contentRect.width;
  return crv > MAX_PAPER_WIDTH ? MAX_PAPER_WIDTH : crv;
}
