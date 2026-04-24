import React from 'react';
import { phaseColor, phaseLabel } from '../../data/phases.js';

export default function MomentsDock({ moments }) {
  const sorted = [...(moments || [])].sort((a, b) => a.x - b.x);

  return (
    <div className="moments-dock">
      <div className="moments-dock-header">
        <span className="moments-dock-title">Moments</span>
        <span className="moments-dock-hint">drag onto a section</span>
      </div>
      <div className="moments-dock-list">
        {sorted.length === 0 && (
          <p className="moments-dock-empty">No moments yet. Add some in the River view.</p>
        )}
        {sorted.map(m => {
          const color = phaseColor(m.phase);
          const label = phaseLabel(m.phase);
          const dragText = [m.title, m.sub, m.detail].filter(Boolean).join(' — ');

          return (
            <div
              key={m.id}
              className="moments-dock-card"
              draggable
              onDragStart={e => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', dragText);
              }}
              title="Drag onto a section field"
            >
              <div className="moments-dock-card-phase">
                <span className="moments-dock-dot" style={{ background: color }} />
                <span className="moments-dock-label" style={{ color }}>{label}</span>
              </div>
              <p className="moments-dock-card-title">{m.title || '(untitled)'}</p>
              {m.sub && <p className="moments-dock-card-sub">{m.sub}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
