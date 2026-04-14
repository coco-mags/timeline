import React, { useRef, useState, useCallback } from 'react';
import { useDrag, getSvgPoint, SVG_W, SVG_H, Y_MIN, Y_MAX, X_START, X_END } from '../hooks/useDrag.js';
import { phaseColor } from '../data/phases.js';

const Y_MID = 100;
const GRID_Y = [48, 100, 152];

function buildPath(moments) {
  if (!moments.length) return '';
  const sorted = [...moments].sort((a, b) => a.x - b.x);

  let d = `M ${X_START} ${Y_MID}`;

  if (sorted.length === 1) {
    const m = sorted[0];
    const cx1 = (X_START + m.x) / 2;
    const cx2 = (X_START + m.x) / 2;
    d += ` C ${cx1} ${Y_MID} ${cx2} ${m.y} ${m.x} ${m.y}`;
    d += ` C ${(m.x + X_END) / 2} ${m.y} ${(m.x + X_END) / 2} ${m.y} ${X_END} ${m.y}`;
    return d;
  }

  // from start to first moment
  const first = sorted[0];
  d += ` C ${(X_START + first.x) / 2} ${Y_MID} ${(X_START + first.x) / 2} ${first.y} ${first.x} ${first.y}`;

  // between moments
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const cx = (prev.x + cur.x) / 2;
    d += ` C ${cx} ${prev.y} ${cx} ${cur.y} ${cur.x} ${cur.y}`;
  }

  // from last moment to end
  const last = sorted[sorted.length - 1];
  d += ` C ${(last.x + X_END) / 2} ${last.y} ${(last.x + X_END) / 2} ${last.y} ${X_END} ${last.y}`;

  return d;
}

function buildFillPath(moments) {
  const curve = buildPath(moments);
  if (!curve) return '';
  const last = [...moments].sort((a, b) => a.x - b.x).slice(-1)[0];
  const lastY = last ? last.y : Y_MID;
  return curve + ` L ${X_END} ${SVG_H} L ${X_START} ${SVG_H} Z`;
}

function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n) + '…' : (str || '');
}

export default function RiverCanvas({ moments, activeMomId, onCanvasClick, onDotClick, onDragMove }) {
  const svgRef = useRef(null);
  const [hoverId, setHoverId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { startDrag } = useDrag({
    onDragMove: (id, x, y) => onDragMove(id, x, y),
    onDragEnd: () => {},
  });

  const handleSvgClick = useCallback((e) => {
    if (!svgRef.current) return;
    const pt = getSvgPoint(svgRef.current, e.clientX, e.clientY);
    const clampedX = Math.max(X_START, Math.min(X_END, pt.x));
    const clampedY = Math.max(Y_MIN, Math.min(Y_MAX, pt.y));
    onCanvasClick(clampedX, clampedY);
  }, [onCanvasClick]);

  const handleDotMouseDown = useCallback((e, mom) => {
    e.stopPropagation();
    startDrag(e, mom.id, svgRef.current);
  }, [startDrag]);

  const handleDotTouchStart = useCallback((e, mom) => {
    e.stopPropagation();
    startDrag(e, mom.id, svgRef.current);
  }, [startDrag]);

  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current) return;
    const pt = getSvgPoint(svgRef.current, e.clientX, e.clientY);
    let found = null;
    for (const m of moments) {
      const dx = pt.x - m.x;
      const dy = pt.y - m.y;
      if (Math.sqrt(dx * dx + dy * dy) < 20) { found = m; break; }
    }
    setHoverId(found ? found.id : null);
    if (found) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, [moments]);

  const curvePath = buildPath(moments);
  const fillPath = buildFillPath(moments);
  const hoverMom = moments.find(m => m.id === hoverId);

  return (
    <div className="river-zone" style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        className="river-svg"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverId(null)}
        style={{ height: '200px' }}
      >
        {/* Arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4 Z" fill="var(--line)" />
          </marker>
        </defs>

        {/* Grid lines */}
        {GRID_Y.map(gy => (
          <line
            key={gy}
            x1={X_START} y1={gy} x2={X_END} y2={gy}
            stroke="var(--line2)" strokeWidth="0.5" strokeDasharray="3,4"
          />
        ))}

        {/* Y axis */}
        <line x1={X_START} y1={Y_MIN} x2={X_START} y2={SVG_H - 16} stroke="var(--line)" strokeWidth="0.5" />
        {/* X axis */}
        <line x1={X_START} y1={SVG_H - 16} x2={X_END + 16} y2={SVG_H - 16} stroke="var(--line)" strokeWidth="0.5" markerEnd="url(#arrowhead)" />

        {/* Y-axis labels */}
        <text x={X_START - 4} y={Y_MIN + 4} textAnchor="end" fontSize="7" fill="var(--line)" fontFamily="var(--font-mono)">smooth</text>
        <text x={X_START - 4} y={Y_MAX} textAnchor="end" fontSize="7" fill="var(--line)" fontFamily="var(--font-mono)">friction</text>
        <text x={X_END + 18} y={SVG_H - 13} fontSize="7" fill="var(--line)" fontFamily="var(--font-mono)">time →</text>

        {/* River fill */}
        {moments.length > 0 && (
          <path d={fillPath} fill="var(--accent)" fillOpacity="0.04" />
        )}

        {/* River curve */}
        {moments.length > 0 && (
          <path
            d={curvePath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeOpacity="0.65"
          />
        )}

        {/* Empty state */}
        {moments.length === 0 && (
          <text
            x={SVG_W / 2} y={SVG_H / 2}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="11" fill="var(--faint)"
            fontFamily="var(--font-serif)" fontStyle="italic"
          >
            Click anywhere to place your first moment
          </text>
        )}

        {/* Moment dots */}
        {moments.map(m => {
          const isActive = m.id === activeMomId;
          const isHover = m.id === hoverId;
          const color = phaseColor(m.phase);
          const outerR = isActive ? 15 : 11;
          const innerR = isActive ? 7 : 5;
          const labelAbove = m.y > Y_MID;
          const titleY = labelAbove ? m.y - innerR - 14 : m.y + innerR + 12;
          const subY = labelAbove ? m.y - innerR - 5 : m.y + innerR + 21;

          return (
            <g
              key={m.id}
              onClick={(e) => { e.stopPropagation(); onDotClick(m.id); }}
              onMouseDown={(e) => handleDotMouseDown(e, m)}
              onTouchStart={(e) => handleDotTouchStart(e, m)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring */}
              <circle cx={m.x} cy={m.y} r={outerR} fill={color} fillOpacity="0.13" />
              {/* Inner dot */}
              <circle
                cx={m.x} cy={m.y} r={innerR}
                fill={color}
                stroke="white" strokeWidth="1.5"
              />
              {/* Title label */}
              <text
                x={m.x} y={titleY}
                textAnchor="middle"
                fontSize="8" fontWeight="500"
                fill="var(--ink)"
                fontFamily="var(--font-sans)"
                pointerEvents="none"
              >
                {truncate(m.title, 17)}
              </text>
              {/* Sub label */}
              {m.sub && (
                <text
                  x={m.x} y={subY}
                  textAnchor="middle"
                  fontSize="7"
                  fill="var(--muted)"
                  fontFamily="var(--font-sans)"
                  pointerEvents="none"
                >
                  {truncate(m.sub, 20)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Artifact hover tooltip */}
      {hoverMom && (
        <div
          className="artifact-tooltip"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 10,
          }}
        >
          <div
            className="artifact-tooltip-phase"
            style={{ color: phaseColor(hoverMom.phase) }}
          >
            {hoverMom.phase}
          </div>
          <div className="artifact-tooltip-title">{hoverMom.title}</div>
          {hoverMom.photos && hoverMom.photos.length > 0 && (
            <div style={{ fontSize: '9px', color: 'var(--muted)', marginBottom: '2px' }}>
              {hoverMom.photos.length} photo{hoverMom.photos.length > 1 ? 's' : ''}
            </div>
          )}
          {hoverMom.sub && (
            <div className="artifact-tooltip-sub">{hoverMom.sub}</div>
          )}
        </div>
      )}
    </div>
  );
}
