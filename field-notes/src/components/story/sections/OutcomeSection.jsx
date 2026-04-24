import React from 'react';

export default function OutcomeSection({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="story-section-fields">
      <label className="story-field-label">What changed
        <textarea
          className="story-field-textarea"
          value={data.changed}
          onChange={e => set('changed', e.target.value)}
          placeholder="What measurable or observable thing improved? One clean stat is enough."
          rows={3}
        />
      </label>
      <label className="story-field-label">Honest caveat
        <textarea
          className="story-field-textarea"
          value={data.honest}
          onChange={e => set('honest', e.target.value)}
          placeholder="What didn't ship, what's still open, or what you'd do differently?"
          rows={3}
        />
      </label>
    </div>
  );
}
