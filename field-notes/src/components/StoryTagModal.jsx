import React, { useState } from 'react';
import { phaseLabel } from '../data/phases.js';

export default function StoryTagModal({
  block, existingTag, moments, activeMomId, prefillMomentId, onSave, onRemove, onClose,
}) {
  const sorted = [...moments].sort((a, b) => a.x - b.x);
  const defaultId = prefillMomentId ?? existingTag?.momentId ?? activeMomId ?? sorted[0]?.id ?? '';

  const [momentId, setMomentId] = useState(defaultId);
  const [reason,   setReason]   = useState(existingTag?.reason ?? '');

  const handleSave = () => {
    if (!momentId) return;
    onSave(Number(momentId), reason.trim());
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal story-tag-modal">
        <div className="story-tag-modal-badge" style={{ backgroundColor: block.color }}>
          {block.label}
        </div>
        <p className="story-tag-modal-sub">
          Which moment best represents this story block?
        </p>

        <select
          className="story-tag-select"
          value={momentId}
          onChange={e => setMomentId(e.target.value)}
        >
          <option value="">Select a moment…</option>
          {sorted.map(m => (
            <option key={m.id} value={m.id}>
              {m.title || '(untitled)'} · {phaseLabel(m.phase)}
            </option>
          ))}
        </select>

        <textarea
          className="story-tag-reason"
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder={`Why does this moment represent "${block.label}"?`}
        />

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          {existingTag && (
            <button className="modal-cancel story-tag-remove" onClick={onRemove}>
              Remove tag
            </button>
          )}
          <button className="modal-create" onClick={handleSave} disabled={!momentId}>
            {existingTag ? 'Update' : 'Tag moment'}
          </button>
        </div>
      </div>
    </div>
  );
}
