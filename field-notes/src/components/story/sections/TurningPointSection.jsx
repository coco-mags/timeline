import React from 'react';

export default function TurningPointSection({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="story-section-fields">
      <label className="story-field-label">Key insight
        <textarea
          className="story-field-textarea"
          value={data.insight}
          onChange={e => set('insight', e.target.value)}
          placeholder="What did you learn that changed the direction? Make it quotable."
          rows={4}
        />
      </label>
      <label className="story-field-label">What you rejected
        <textarea
          className="story-field-textarea"
          value={data.rejected}
          onChange={e => set('rejected', e.target.value)}
          placeholder="What obvious path did you decide not to take, and why?"
          rows={3}
        />
      </label>
    </div>
  );
}
