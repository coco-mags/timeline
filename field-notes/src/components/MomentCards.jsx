import React, { useState } from 'react';
import { phaseColor, phaseLabel } from '../data/phases.js';

export default function MomentCards({ moments, activeMomId, onSelect, onAdd, onDelete, onReorder, storyTags = [], storyBlocks = [] }) {
  const [dragId,     setDragId]     = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const sorted = [...moments].sort((a, b) => a.x - b.x);

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('momentId', id.toString());
  };

  const handleDragEnter = (e, id) => {
    e.preventDefault();
    if (id !== dragId) setDragOverId(id);
  };

  const handleDragOver  = (e) => { e.preventDefault(); };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOverId(null);
  };

  const handleDrop = (e, toId) => {
    e.preventDefault();
    if (dragId && dragId !== toId) onReorder(dragId, toId);
    setDragId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => { setDragId(null); setDragOverId(null); };

  return (
    <div className="moment-cards-strip">
      {sorted.map(m => {
        const color       = phaseColor(m.phase);
        const label       = phaseLabel(m.phase);
        const blockTags   = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id && t.momentId === m.id));

        return (
          <div
            key={m.id}
            draggable
            onDragStart={(e) => handleDragStart(e, m.id)}
            onDragEnter={(e) => handleDragEnter(e, m.id)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, m.id)}
            onDragEnd={handleDragEnd}
            className={
              'moment-card' +
              (m.id === activeMomId  ? ' active'    : '') +
              (m.id === dragId       ? ' dragging'  : '') +
              (m.id === dragOverId   ? ' drag-over' : '')
            }
            onClick={() => onSelect(m.id)}
          >
            <button
              className="moment-card-delete"
              onClick={(e) => { e.stopPropagation(); onDelete(m.id); }}
              title="Delete moment"
            >✕</button>

            {/* Phase — primary identifier */}
            <div className="moment-card-phase">
              <div className="moment-card-dot" style={{ backgroundColor: color }} />
              <span className="moment-card-phase-label" style={{ color }}>
                {label}
              </span>
            </div>

            {/* Title */}
            <div className="moment-card-title">{m.title || '(untitled)'}</div>

            {/* Story block tags — secondary layer */}
            {blockTags.length > 0 && (
              <div className="moment-card-story-tags">
                {blockTags.map(b => (
                  <span
                    key={b.id}
                    className="moment-card-story-tag"
                    style={{ borderColor: b.color, color: b.color }}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button className="moment-card-add" onClick={onAdd}>
        <span style={{ fontSize: '16px' }}>+</span>
        <span>add moment</span>
      </button>
    </div>
  );
}
