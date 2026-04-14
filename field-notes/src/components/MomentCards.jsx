import React from 'react';
import { phaseColor, phaseLabel } from '../data/phases.js';

export default function MomentCards({ moments, activeMomId, onSelect, onAdd }) {
  return (
    <div className="moment-cards-strip">
      {moments.map(m => (
        <div
          key={m.id}
          className={'moment-card' + (m.id === activeMomId ? ' active' : '')}
          onClick={() => onSelect(m.id)}
        >
          <div className="moment-card-phase">
            <div
              className="moment-card-dot"
              style={{ backgroundColor: phaseColor(m.phase) }}
            />
            <span className="moment-card-phase-label">{phaseLabel(m.phase)}</span>
          </div>
          <div className="moment-card-title">{m.title || '(untitled)'}</div>
          {m.sub && <div className="moment-card-sub">{m.sub}</div>}
        </div>
      ))}
      <button className="moment-card-add" onClick={onAdd}>
        <span style={{ fontSize: '16px' }}>+</span>
        <span>add moment</span>
      </button>
    </div>
  );
}
