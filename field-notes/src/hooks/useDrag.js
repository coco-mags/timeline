import { useRef, useCallback } from 'react';

const SVG_W = 580;
const SVG_H = 200;
const Y_MIN = 22;
const Y_MAX = 178;
const X_START = 50;
const X_END = 540;

function getSvgPoint(svg, clientX, clientY) {
  // The SVG viewBox matches the container pixel dimensions exactly (dynW × dynH),
  // so client offset IS the SVG coordinate — no scaling needed.
  const rect = svg.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

export function useDrag({ onDragMove, onDragEnd }) {
  const draggingId = useRef(null);
  const svgRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const startDrag = useCallback((e, momentId, svg, dotX, dotY) => {
    e.stopPropagation();
    draggingId.current = momentId;
    svgRef.current = svg;

    // Calculate where inside the dot the user grabbed it
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const grabPt = getSvgPoint(svg, clientX, clientY);
    offsetRef.current = { x: grabPt.x - dotX, y: grabPt.y - dotY };

    const handleMove = (ev) => {
      if (draggingId.current === null) return;
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
      const pt = getSvgPoint(svgRef.current, cx, cy);
      onDragMove(draggingId.current, pt.x - offsetRef.current.x, pt.y - offsetRef.current.y);
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
