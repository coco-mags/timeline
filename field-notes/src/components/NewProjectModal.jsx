import React, { useState } from 'react';

const PROJECT_COLORS = [
  '#2c2a26', '#7b9cc4', '#b88fc2', '#8aab7e',
  '#d4856a', '#9c8060', '#9c9890', '#c0907a',
];

export default function NewProjectModal({ onCreate, onCancel }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), color });
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal">
        <div className="modal-title">New project</div>
        <input
          className="modal-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Project name"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <div className="color-swatches">
          {PROJECT_COLORS.map(c => (
            <div
              key={c}
              className={'color-swatch' + (color === c ? ' selected' : '')}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-create" onClick={handleCreate} disabled={!name.trim()}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
