import React from 'react';

export default function ProblemSection({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="story-section-fields">
      <label className="story-field-label">Problem name
        <input
          className="story-field-input"
          value={data.name}
          onChange={e => set('name', e.target.value)}
          placeholder="Give the problem a sharp, memorable name"
        />
      </label>
      <label className="story-field-label">Evidence
        <textarea
          className="story-field-textarea"
          value={data.evidence}
          onChange={e => set('evidence', e.target.value)}
          placeholder="What data, observations, or quotes proved this was real?"
          rows={3}
        />
      </label>
      <label className="story-field-label">Competitive gap
        <textarea
          className="story-field-textarea"
          value={data.competitive}
          onChange={e => set('competitive', e.target.value)}
          placeholder="What were existing solutions missing or getting wrong?"
          rows={3}
        />
      </label>
    </div>
  );
}
