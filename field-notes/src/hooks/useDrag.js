import { useRef, useCallback } from 'react';

const SVG_W = 580;
const SVG_H = 200;
const Y_MIN = 22;
const Y_MAX = 178;
const X_START = 50;
const X_END = 540;

function getSvgPoint(svg, clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (SVG_W / rect.width),
    y: (clientY - rect.top)  * (SVG_H / rect.height),
  };
}

export function useDrag({ onDragMove, onDragEnd }) {
  const draggingId = useRef(null);
  const svgRef = useRef(null);

  const startDrag = useCallback((e, momentId, svg) => {
    e.stopPropagation();
    draggingId.current = momentId;
    svgRef.current = svg;

    const handleMove = (ev) => {
      if (draggingId.current === null) return;
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const pt = getSvgPoint(svgRef.current, clientX, clientY);
      const clampedY = Math.max(Y_MIN, Math.min(Y_MAX, pt.y));
      const clampedX = Math.max(X_START, Math.min(X_END, pt.x));
      onDragMove(draggingId.current, clampedX, clampedY);
    };

    const handleUp = () => {
      if (draggingId.current !== null) {
        onDragEnd && onDragEnd(draggingId.current);
        draggingId.current = null;
      }
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
  }, [onDragMove, onDragEnd]);

  return { startDrag };
}

export { getSvgPoint, SVG_W, SVG_H, Y_MIN, Y_MAX, X_START, X_END };
