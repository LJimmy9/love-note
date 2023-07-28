export interface Position {
  x: number;
  y: number;
}

export function handleResize(
  el: HTMLDivElement,
  updatePosCb: (pos: Position) => void,
  updateWindowSizeCb: (windowX: number, windowY: number) => void
) {
  const rect = el.getBoundingClientRect();
  const x = rect.left;
  const y = rect.top;
  updatePosCb({ x: x, y: y });

  const windowX = window.innerWidth;
  const windowY = window.innerHeight;

  updateWindowSizeCb(windowX, windowY);
}
