import React, { useState } from 'react';

const SECTIONS = [
  { id: 'hook',         label: 'Hook' },
  { id: 'problem',      label: 'Problem' },
  { id: 'turningPoint', label: 'Turning Point' },
  { id: 'role',         label: 'Role' },
  { id: 'process',      label: 'Process' },
  { id: 'outcome',      label: 'Outcome' },
  { id: 'learning',     label: 'Learning' },
  { id: 'next',         label: 'Next' },
];

function sectionFilled(sb, id) {
  if (!sb) return false;
  const section = sb[id];
  if (!section) return false;
  if (id === 'process') {
    const cards = Array.isArray(section) ? section : (section.cards || []);
    return cards.some(c => c.name && c.name.trim());
  }
  return Object.values(section).some(v => typeof v === 'string' && v.trim());
}

export default function SectionNav({ activeId, onSelect, onDropMoment, storyBuilder }) {
  const [dropTargetId, setDropTargetId] = useState(null);

  return (
    <nav className="story-section-nav">
      {SECTIONS.map(s => {
        const filled = sectionFilled(storyBuilder, s.id);
        return (
          <button
            key={s.id}
            className={
              'story-nav-item' +
              (s.id === activeId    ? ' active'      : '') +
              (filled               ? ' filled'      : '') +
              (s.id === dropTargetId ? ' drop-target' : '')
            }
            onClick={() => onSelect(s.id)}
            onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setDropTargetId(s.id); }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDropTargetId(null); }}
            onDrop={e => {
              e.preventDefault();
              setDropTargetId(null);
              const text = e.dataTransfer.getData('text/plain');
              if (text && onDropMoment) onDropMoment(s.id, text);
            }}
          >
            <span className="story-nav-label">{s.label}</span>
            {filled && <span className="story-nav-dot" />}
          </button>
        );
      })}
    </nav>
  );
}
