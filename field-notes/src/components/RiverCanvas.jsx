import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDrag, getSvgPoint, SVG_W, SVG_H, Y_MIN, Y_MAX, X_START, X_END } from '../hooks/useDrag.js';
import { phaseColor } from '../data/phases.js';

// Normalised grid lines (fractions of height)
const GRID_Y_NORMS = [0.24, 0.5, 0.76];

function buildPath(moments, { xStart, xEnd, yMid }) {
  if (!moments.length) return '';
  const sorted = [...moments].sort((a, b) => a.x - b.x);
  let d = `M ${xStart} ${yMid}`;

  if (sorted.length === 1) {
    const m = sorted[0];
    d += ` C ${(xStart + m.x) / 2} ${yMid} ${(xStart + m.x) / 2} ${m.y} ${m.x} ${m.y}`;
    d += ` C ${(m.x + xEnd) / 2} ${m.y} ${(m.x + xEnd) / 2} ${m.y} ${xEnd} ${m.y}`;
    return d;
  }

  const first = sorted[0];
  d += ` C ${(xStart + first.x) / 2} ${yMid} ${(xStart + first.x) / 2} ${first.y} ${first.x} ${first.y}`;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur  = sorted[i];
    const cx   = (prev.x + cur.x) / 2;
    d += ` C ${cx} ${prev.y} ${cx} ${cur.y} ${cur.x} ${cur.y}`;
  }

  const last = sorted[sorted.length - 1];
  d += ` C ${(last.x + xEnd) / 2} ${last.y} ${(last.x + xEnd) / 2} ${last.y} ${xEnd} ${last.y}`;
  return d;
}

function buildFillPath(moments, consts) {
  const curve = buildPath(moments, consts);
  if (!curve) return '';
  return curve + ` L ${consts.xEnd} ${consts.h} L ${consts.xStart} ${consts.h} Z`;
}

function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n) + '…' : (str || '');
}

export default function RiverCanvas({ moments, activeMomId, onCanvasClick, onDotClick, onDragMove, storyTags = [], storyBlocks = [] }) {
  const containerRef = useRef(null);
  const svgRef       = useRef(null);
  const dragOccurred = useRef(false);

  const [hoverId,    setHoverId]    = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [dynW,       setDynW]       = useState(SVG_W);
  const [dynH,       setDynH]       = useState(SVG_H);

  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDynW(width);
        setDynH(height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scale stored coords (0..SVG_W × 0..SVG_H) → display coords (0..dynW × 0..dynH)
  const toDisp = useCallback((mx, my) => ({
    x: (mx / SVG_W) * dynW,
    y: (my / SVG_H) * dynH,
  }), [dynW, dynH]);

  // Scale display coords back to storage space with clamping
  const toStore = useCallback((dx, dy) => ({
    x: Math.max(X_START, Math.min(X_END, (dx / dynW) * SVG_W)),
    y: Math.max(Y_MIN,   Math.min(Y_MAX, (dy / dynH) * SVG_H)),
  }), [dynW, dynH]);

  // Dynamic layout constants in display space
  const dXStart = (X_START / SVG_W) * dynW;
  const dXEnd   = (X_END   / SVG_W) * dynW;
  const dYMin   = (Y_MIN   / SVG_H) * dynH;
  const dYMax   = (Y_MAX   / SVG_H) * dynH;
  const dYMid   = dynH * 0.5;
  const dGridY  = GRID_Y_NORMS.map(n => n * dynH);
  const consts  = { xStart: dXStart, xEnd: dXEnd, yMid: dYMid, h: dynH };

  // Moments scaled to display space for rendering, enriched with story block tags
  const dispMoments = moments.map(m => ({
    ...m,
    ...toDisp(m.x, m.y),
    blockTags: storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id && t.momentId === m.id)),
  }));

  const { startDrag } = useDrag({
    onDragMove: (id, dx, dy) => {
      dragOccurred.current = true;
      const s = toStore(dx, dy);
      onDragMove(id, s.x, s.y);
    },
    onDragEnd: () => {},
  });

  const handleSvgClick = useCallback((e) => {
    if (dragOccurred.current) {
      dragOccurred.current = false;
      return;
    }
    if (!svgRef.current) return;
    const pt = getSvgPoint(svgRef.current, e.clientX, e.clientY);
    const s  = toStore(pt.x, pt.y);
    onCanvasClick(s.x, s.y);
  }, [onCanvasClick, toStore]);

  // Pass display coords to useDrag so the offset is computed in the same space
  const handleDotMouseDown = useCallback((e, m) => {
    e.stopPropagation();
    startDrag(e, m.id, svgRef.current, m.x, m.y); // m is already in display space
  }, [startDrag]);

  const handleDotTouchStart = useCallback((e, m) => {
    e.stopPropagation();
    startDrag(e, m.id, svgRef.current, m.x, m.y);
  }, [startDrag]);

  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current) return;
    const pt = getSvgPoint(svgRef.current, e.clientX, e.clientY);
    let found = null;
    for (const m of dispMoments) {
      const dx = pt.x - m.x;
      const dy = pt.y - m.y;
      if (Math.sqrt(dx * dx + dy * dy) < 20) { found = m; break; }
    }
    setHoverId(found ? found.id : null);
    if (found) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [dispMoments]);

  const curvePath = buildPath(dispMoments, consts);
  const fillPath  = buildFillPath(dispMoments, consts);
  const hoverMom  = moments.find(m => m.id === hoverId);

  return (
    <div ref={containerRef} className="river-zone">
      <svg
        ref={svgRef}
        className="river-svg"
        viewBox={`0 0 ${dynW} ${dynH}`}
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverId(null)}
      >
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4 Z" fill="var(--line)" />
          </marker>
        </defs>

        {/* Grid lines */}
        {dGridY.map((gy, i) => (
          <line key={i} x1={dXStart} y1={gy} x2={dXEnd} y2={gy}
            stroke="var(--line2)" strokeWidth="0.5" strokeDasharray="3,4" />
        ))}

        {/* Y axis */}
        <line x1={dXStart} y1={dYMin} x2={dXStart} y2={dynH - 16}
          stroke="var(--line)" strokeWidth="0.5" />
        {/* X axis */}
        <line x1={dXStart} y1={dynH - 16} x2={dXEnd + 16} y2={dynH - 16}
          stroke="var(--line)" strokeWidth="0.5" markerEnd="url(#arrowhead)" />

        {/* Axis labels */}
        <text x={dXStart - 4} y={dYMin + 4} textAnchor="end" fontSize="7"
          fill="var(--line)" fontFamily="var(--font-mono)">smooth</text>
        <text x={dXStart - 4} y={dYMax} textAnchor="end" fontSize="7"
          fill="var(--line)" fontFamily="var(--font-mono)">friction</text>
        <text x={dXEnd + 18} y={dynH - 13} fontSize="7"
          fill="var(--line)" fontFamily="var(--font-mono)">time →</text>

        {/* River fill */}
        {dispMoments.length > 0 && (
          <path d={fillPath} fill="var(--accent)" fillOpacity="0.04" />
        )}

        {/* River curve */}
        {dispMoments.length > 0 && (
          <path d={curvePath} fill="none" stroke="var(--accent)"
            strokeWidth="2" strokeOpacity="0.65" />
        )}

        {/* Empty state */}
        {dispMoments.length === 0 && (
          <text x={dynW / 2} y={dynH / 2}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="11" fill="var(--faint)"
            fontFamily="var(--font-serif)" fontStyle="italic">
            Click anywhere to place your first moment
          </text>
        )}

        {/* Moment dots */}
        {dispMoments.map(m => {
          const isActive   = m.id === activeMomId;
          const color      = phaseColor(m.phase);
          const outerR     = isActive ? 15 : 11;
          const innerR     = isActive ? 7  : 5;
          const labelAbove = m.y > dYMid;
          const titleY     = labelAbove ? m.y - innerR - 14 : m.y + innerR + 12;
          const subY       = labelAbove ? m.y - innerR - 5  : m.y + innerR + 21;
          const tags       = m.blockTags || [];

          // Story block arc segments on the outer ring
          // Divide the ring into equal arc slices, one per block
          const arcR      = outerR + 4;
          const arcSlice  = tags.length > 0 ? (2 * Math.PI) / tags.length : 0;

          // Small label dots row positioned away from the text labels
          const lastTextY = m.sub ? subY : titleY;
          const dotsY     = labelAbove ? titleY - 10 : lastTextY + 10;
          const dotsStartX = m.x - ((tags.length - 1) * 7) / 2;

          return (
            <g key={m.id}
              onClick={(e) => { e.stopPropagation(); onDotClick(m.id); }}
              onMouseDown={(e) => handleDotMouseDown(e, m)}
              onTouchStart={(e) => handleDotTouchStart(e, m)}
              style={{ cursor: 'pointer' }}
            >
              {/* Story block arc segments around outer ring */}
              {tags.map((b, i) => {
                const startAngle = i * arcSlice - Math.PI / 2;
                const endAngle   = startAngle + arcSlice - 0.08;
                const x1 = m.x + arcR * Math.cos(startAngle);
                const y1 = m.y + arcR * Math.sin(startAngle);
                const x2 = m.x + arcR * Math.cos(endAngle);
                const y2 = m.y + arcR * Math.sin(endAngle);
                const largeArc = arcSlice > Math.PI ? 1 : 0;
                return (
                  <path
                    key={b.id}
                    d={`M ${x1} ${y1} A ${arcR} ${arcR} 0 ${largeArc} 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={b.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    pointerEvents="none"
                  />
                );
              })}

              {/* Pulse ring */}
              <circle cx={m.x} cy={m.y} r={outerR} fill={color} fillOpacity="0.13" />
              {/* Inner dot */}
              <circle cx={m.x} cy={m.y} r={innerR} fill={color} stroke="white" strokeWidth="1.5" />

              {/* Title label */}
              <text x={m.x} y={titleY} textAnchor="middle" fontSize="8" fontWeight="500"
                fill="var(--ink)" fontFamily="var(--font-sans)" pointerEvents="none">
                {truncate(m.title, 17)}
              </text>
              {m.sub && (
                <text x={m.x} y={subY} textAnchor="middle" fontSize="7"
                  fill="var(--muted)" fontFamily="var(--font-sans)" pointerEvents="none">
                  {truncate(m.sub, 20)}
                </text>
              )}

              {/* Story block label dots row */}
              {tags.map((b, i) => (
                <circle
                  key={b.id}
                  cx={dotsStartX + i * 7}
                  cy={dotsY}
                  r="2.5"
                  fill={b.color}
                  pointerEvents="none"
                />
              ))}
            </g>
          );
        })}
      </svg>

      {hoverMom && (() => {
        const hoverBlocks = storyBlocks.filter(b =>
          storyTags.some(t => t.blockId === b.id && t.momentId === hoverMom.id)
        );
        return (
          <div className="artifact-tooltip"
            style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 10 }}>
            {/* Phase */}
            <div className="artifact-tooltip-phase" style={{ color: phaseColor(hoverMom.phase) }}>
              {hoverMom.phase}
            </div>
            {/* Title */}
            <div className="artifact-tooltip-title">{hoverMom.title}</div>
            {/* Sub */}
            {hoverMom.sub && (
              <div className="artifact-tooltip-sub">{hoverMom.sub}</div>
            )}
            {/* Photos */}
            {hoverMom.photos?.length > 0 && (
              <div style={{ fontSize: '9px', color: 'var(--muted)', marginTop: '2px' }}>
                {hoverMom.photos.length} photo{hoverMom.photos.length > 1 ? 's' : ''}
              </div>
            )}
            {/* Story block tags */}
            {hoverBlocks.length > 0 && (
              <div className="artifact-tooltip-blocks">
                {hoverBlocks.map(b => (
                  <span
                    key={b.id}
                    className="artifact-tooltip-block"
                    style={{ borderColor: b.color, color: b.color }}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
