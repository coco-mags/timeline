import React from 'react';

export default function HookSection({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="story-section-fields">
      <label className="story-field-label">Title
        <input
          className="story-field-input"
          value={data.title}
          onChange={e => set('title', e.target.value)}
          placeholder="What is this project called?"
        />
      </label>
      <label className="story-field-label">Context line
        <input
          className="story-field-input"
          value={data.contextLine}
          onChange={e => set('contextLine', e.target.value)}
          placeholder="One line about the company, product, or domain"
        />
      </label>
      <label className="story-field-label">Opening
        <textarea
          className="story-field-textarea"
          value={data.opening}
          onChange={e => set('opening', e.target.value)}
          placeholder="What was the world like before you started? Open with the human experience, not the solution."
          rows={4}
        />
      </label>
    </div>
  );
}
