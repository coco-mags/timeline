import React, { useState, useRef, useEffect } from 'react';
import { phaseColor, phaseLabel } from '../../data/phases.js';

export default function PullFromMoments({ moments, phaseFilter, onInsert }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Filter by phase. null means all phases.
  const filtered = (moments || []).filter(m =>
    !phaseFilter || phaseFilter.includes(m.phase)
  ).sort((a, b) => a.x - b.x);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (filtered.length === 0) return null;

  return (
    <div className="flow-pull-wrap" ref={ref}>
      <button
        className={'flow-pull-btn' + (open ? ' open' : '')}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        Pull from moments
      </button>
      {open && (
        <div className="flow-pull-popover">
          {filtered.map(m => (
            <button
              key={m.id}
              className="flow-pull-item"
              onClick={() => {
                onInsert(m.detail || m.sub || m.title || '');
                setOpen(false);
              }}
              type="button"
            >
              <span
                className="flow-pull-dot"
                style={{ background: phaseColor(m.phase) }}
              />
              <span className="flow-pull-phase" style={{ color: phaseColor(m.phase) }}>
                {phaseLabel(m.phase)}
              </span>
              <span className="flow-pull-title">{m.title || '(untitled)'}</span>
              {m.sub && <span className="flow-pull-sub">{m.sub}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
