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

// Returns the SVG path string for a diamond centered at (cx, cy) with half-size r
function diamond(cx, cy, r) {
  return `M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`;
}

export default function RiverCanvas({ moments, activeMomId, onCanvasClick, onDotClick, onDragMove, onAdd, storyTags = [], storyBlocks = [] }) {
  const containerRef = useRef(null);
  const svgRef       = useRef(null);
  const dragOccurred = useRef(false);

  const [hoverId,      setHoverId]      = useState(null);
  const [tooltipPos,   setTooltipPos]   = useState({ x: 0, y: 0 });
  const [insertPos,    setInsertPos]    = useState(null); // { x, y } in display space
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

  // Moments scaled to display space for rendering, enriched with story block tags.
  // X positions are always evenly distributed; stored x only determines order.
  const dispMoments = (() => {
    const sorted = [...moments].sort((a, b) => a.x - b.x);
    const n = sorted.length;
    return sorted.map((m, i) => {
      const evenX = dXStart + ((i + 1) / (n + 1)) * (dXEnd - dXStart);
      const { y: dispY } = toDisp(m.x, m.y);
      return {
        ...m,
        x: evenX,
        y: dispY,
        orderIndex: i,
        blockTags: storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id && t.momentId === m.id)),
      };
    });
  })();

  const { startDrag } = useDrag({
    onDragMove: (id, dx, dy) => {
      dragOccurred.current = true;
      const s = toStore(dx, dy);
      const originalMoment = moments.find(m => m.id === id);
      // Lock x to original position — only allow vertical (y) movement
      onDragMove(id, originalMoment ? originalMoment.x : s.x, s.y);
    },
    onDragEnd: () => {},
  });

  const handleSvgClick = useCallback((e) => {
    if (dragOccurred.current) {
      dragOccurred.current = false;
      return;
    }
    if (!svgRef.current) return;
    // If we have a snapped insertion point, use that x; otherwise use cursor position
    const rect = svgRef.current.getBoundingClientRect();
    const px   = e.clientX - rect.left;
    const py   = e.clientY - rect.top;
    const clickX = insertPos ? insertPos.x : px;
    const clickY = insertPos ? insertPos.y : py;
    const s = toStore(clickX, clickY);
    onCanvasClick(s.x, s.y);
  }, [onCanvasClick, toStore, insertPos]);

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
    const rect = svgRef.current.getBoundingClientRect();
    // Direct pixel coords — viewBox = dynW×dynH so no scaling needed
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Check if near an existing dot
    let found = null;
    for (const m of dispMoments) {
      const dx = px - m.x;
      const dy = py - m.y;
      if (Math.abs(dx) + Math.abs(dy) < 22) { found = m; break; }
    }
    setHoverId(found ? found.id : null);
    if (found) setTooltipPos({ x: px, y: py });

    // Show insertion indicator snapped to midpoint between two adjacent dots
    const inChart = px >= dXStart && px <= dXEnd && py >= dYMin - 10 && py <= dYMax + 20;
    if (!found && inChart && dispMoments.length > 0) {
      const sorted = [...dispMoments].sort((a, b) => a.x - b.x);

      // Find which gap the cursor is in, then snap to the midpoint of that gap
      let snapX, snapY;

      if (sorted.length === 1) {
        // Only one dot — show midpoint between start/end and the dot
        if (px < sorted[0].x) {
          snapX = (dXStart + sorted[0].x) / 2;
          snapY = sorted[0].y;
        } else {
          snapX = (sorted[0].x + dXEnd) / 2;
          snapY = sorted[0].y;
        }
      } else {
        // Multiple dots — find the nearest gap midpoint to the cursor
        let bestDist = Infinity;
        snapX = sorted[0].x;
        snapY = sorted[0].y;
        for (let i = 0; i < sorted.length - 1; i++) {
          const midX = (sorted[i].x + sorted[i + 1].x) / 2;
          const midY = (sorted[i].y + sorted[i + 1].y) / 2;
          const dist = Math.abs(px - midX);
          if (dist < bestDist) {
            bestDist = dist;
            snapX = midX;
            snapY = midY;
          }
        }
      }
      setInsertPos({ x: snapX, y: snapY });
    } else {
      setInsertPos(null);
    }
  }, [dispMoments, dXStart, dXEnd, dYMin, dYMax]);

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
        onMouseLeave={() => { setHoverId(null); setInsertPos(null); }}
        style={{ cursor: insertPos ? 'crosshair' : 'default' }}
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
        <text x={dXStart - 4} y={dYMin + 4} textAnchor="end" fontSize="0.4375rem"
          fill="var(--line)" fontFamily="var(--font-mono)">smooth</text>
        <text x={dXStart - 4} y={dYMax} textAnchor="end" fontSize="0.4375rem"
          fill="var(--line)" fontFamily="var(--font-mono)">friction</text>
        <text x={dXEnd + 18} y={dynH - 13} fontSize="0.4375rem"
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
            fontSize="0.6875rem" fill="var(--faint)"
            fontFamily="var(--font-serif)" fontStyle="italic">
            Click anywhere to place your first moment
          </text>
        )}

        {/* Insertion indicator */}
        {insertPos && (
          <g pointerEvents="none">
            {/* Vertical dashed line spanning chart height */}
            <line
              x1={insertPos.x} y1={dYMin - 6}
              x2={insertPos.x} y2={dYMax + 6}
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="3,3"
              strokeOpacity="0.5"
            />
            {/* Circle with + at the river line position */}
            <circle
              cx={insertPos.x}
              cy={insertPos.y}
              r={11}
              fill="var(--color-bg, #fff)"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeOpacity="0.9"
            />
            <text
              x={insertPos.x}
              y={insertPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="0.875rem"
              fontWeight="400"
              fill="var(--accent)"
              style={{ userSelect: 'none' }}
            >+</text>
          </g>
        )}

        {/* Moment dots — diamond shape */}
        {dispMoments.map(m => {
          const isActive   = m.id === activeMomId;
          const isHovered  = m.id === hoverId;
          const color      = phaseColor(m.phase);
          // Diamond half-size: distance from center to each tip
          const outerR     = isActive ? 18 : 13;
          const innerR     = isActive ? 10 : 7;
          const labelAbove = m.y > dYMid;
          const labelGap   = 14;
          const titleY     = labelAbove ? m.y - outerR - labelGap - 4 : m.y + outerR + labelGap;
          const subY       = labelAbove ? titleY - 11 : titleY + 11;
          const tags       = m.blockTags || [];
          // Phase initial for the center label
          const initial    = (m.phase || 'o')[0].toUpperCase();

          // Story block circular arcs outside the outer diamond
          const arcR     = outerR + 6;
          const arcSlice = tags.length > 0 ? (2 * Math.PI) / tags.length : 0;

          // Tag dots row
          const lastTextY  = m.sub ? subY : titleY;
          const dotsY      = labelAbove ? titleY - 10 : lastTextY + 10;
          const dotsStartX = m.x - ((tags.length - 1) * 7) / 2;

          return (
            <g key={m.id}
              className="moment-dot-group"
              onClick={(e) => { e.stopPropagation(); onDotClick(m.id); }}
              onMouseDown={(e) => handleDotMouseDown(e, m)}
              onTouchStart={(e) => handleDotTouchStart(e, m)}
            >
              {/* Animated pulse diamonds for active dot */}
              {isActive && (
                <>
                  <path d={diamond(m.x, m.y, outerR + 5)}
                    fill="none" stroke={color} strokeWidth="1.5"
                    className="dot-pulse-ring" />
                  <path d={diamond(m.x, m.y, outerR + 5)}
                    fill="none" stroke={color} strokeWidth="1"
                    className="dot-pulse-ring-slow" />
                </>
              )}

              {/* Soft glow — diamond shaped */}
              <path d={diamond(m.x, m.y, outerR + 3)}
                fill={color}
                fillOpacity={isActive ? 0.15 : isHovered ? 0.12 : 0.06} />

              {/* Story block circular arcs orbiting the diamond */}
              {tags.map((b, i) => {
                const startAngle = i * arcSlice - Math.PI / 2;
                const endAngle   = startAngle + arcSlice - 0.1;
                const x1 = m.x + arcR * Math.cos(startAngle);
                const y1 = m.y + arcR * Math.sin(startAngle);
                const x2 = m.x + arcR * Math.cos(endAngle);
                const y2 = m.y + arcR * Math.sin(endAngle);
                return (
                  <path key={b.id}
                    d={`M ${x1} ${y1} A ${arcR} ${arcR} 0 ${arcSlice > Math.PI ? 1 : 0} 1 ${x2} ${y2}`}
                    fill="none" stroke={b.color} strokeWidth="3" strokeLinecap="round"
                    pointerEvents="none" />
                );
              })}

              {/* Outer diamond stroke */}
              <path d={diamond(m.x, m.y, outerR)}
                fill="none"
                stroke={color}
                strokeWidth={isActive ? 2 : 1.5}
                strokeOpacity={isActive ? 1 : 0.6} />

              {/* Inner filled diamond */}
              <path d={diamond(m.x, m.y, innerR)}
                fill={color}
                stroke="var(--color-bg, #fff)"
                strokeWidth="1.5" />

              {/* Phase initial centered */}
              <text x={m.x} y={m.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={isActive ? '0.5rem' : '0.4375rem'}
                fontWeight="700"
                fill="var(--color-bg, #fff)"
                fontFamily="var(--font-mono)"
                pointerEvents="none"
                style={{ userSelect: 'none' }}>
                {initial}
              </text>

              {/* Connector tick from diamond tip to label */}
              <line
                x1={m.x}
                y1={labelAbove ? m.y - outerR : m.y + outerR}
                x2={m.x}
                y2={labelAbove ? m.y - outerR - labelGap + 2 : m.y + outerR + labelGap - 2}
                stroke={color} strokeWidth="1" strokeOpacity="0.3"
                strokeDasharray="2,2"
                pointerEvents="none" />

              {/* Title label */}
              <text x={m.x} y={titleY}
                textAnchor="middle"
                fontSize="0.5rem"
                fontWeight={isActive ? 600 : 500}
                fill={isActive ? color : 'var(--ink)'}
                fontFamily="var(--font-sans)" pointerEvents="none">
                {truncate(m.title, 17)}
              </text>
              {m.sub && (
                <text x={m.x} y={subY}
                  textAnchor="middle" fontSize="0.4375rem"
                  fill="var(--muted)" fontFamily="var(--font-sans)" pointerEvents="none">
                  {truncate(m.sub, 20)}
                </text>
              )}

              {/* Story block tag dots */}
              {tags.map((b, i) => (
                <circle key={b.id}
                  cx={dotsStartX + i * 7} cy={dotsY} r="2.5"
                  fill={b.color} pointerEvents="none" />
              ))}
            </g>
          );
        })}
      </svg>

      {/* Add moment button — right edge of chart */}
      {onAdd && (
        <button className="river-add-btn" onClick={onAdd} title="Add a new moment">
          <span className="river-add-icon">+</span>
          <span className="river-add-label">Add moment</span>
        </button>
      )}

      {hoverMom && (() => {
        const hoverBlocks = storyBlocks.filter(b =>
          storyTags.some(t => t.blockId === b.id && t.momentId === hoverMom.id)
        );
        const photos  = hoverMom.photos || [];
        const steps   = (hoverMom.steps || []);
        const doneSteps = steps.filter(s => s.done).length;

        // Smart position: flip left if too close to right edge
        const flipLeft = tooltipPos.x > dynW * 0.65;

        return (
          <div
            className="moment-tooltip"
            style={{
              left:  flipLeft ? 'auto' : tooltipPos.x + 16,
              right: flipLeft ? (dynW - tooltipPos.x + 16) : 'auto',
              top:   tooltipPos.y - 10,
            }}
          >
            {/* Phase badge */}
            <div className="moment-tooltip-phase" style={{ backgroundColor: phaseColor(hoverMom.phase) }}>
              {hoverMom.phase}
            </div>

            {/* Title */}
            <div className="moment-tooltip-title">{hoverMom.title || '(untitled)'}</div>

            {/* Sub */}
            {hoverMom.sub && (
              <div className="moment-tooltip-sub">{hoverMom.sub}</div>
            )}

            {/* Why it matters */}
            {hoverMom.whyItMatters && (
              <div className="moment-tooltip-why">
                <span className="moment-tooltip-why-label">Why it matters</span>
                <span>{hoverMom.whyItMatters}</span>
              </div>
            )}

            {/* Photos */}
            {photos.length > 0 && (
              <div className="moment-tooltip-photos">
                {photos.slice(0, 4).map((src, i) => (
                  <img key={i} src={src} className="moment-tooltip-photo" alt="" />
                ))}
                {photos.length > 4 && (
                  <div className="moment-tooltip-photo-more">+{photos.length - 4}</div>
                )}
              </div>
            )}

            {/* Design steps progress */}
            {steps.length > 0 && (
              <div className="moment-tooltip-steps">
                <div className="moment-tooltip-steps-bar">
                  <div
                    className="moment-tooltip-steps-fill"
                    style={{ width: `${(doneSteps / steps.length) * 100}%`, backgroundColor: phaseColor(hoverMom.phase) }}
                  />
                </div>
                <span className="moment-tooltip-steps-label">
                  {doneSteps}/{steps.length} steps
                </span>
              </div>
            )}

            {/* Story block tags */}
            {hoverBlocks.length > 0 && (
              <div className="moment-tooltip-blocks">
                {hoverBlocks.map(b => (
                  <span key={b.id} className="moment-tooltip-block" style={{ color: b.color }}>
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
