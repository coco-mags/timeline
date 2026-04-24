import React from 'react';

export default function RoleSection({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="story-section-fields">
      <label className="story-field-label">Your contribution
        <textarea
          className="story-field-textarea"
          value={data.contribution}
          onChange={e => set('contribution', e.target.value)}
          placeholder="What did you specifically own or drive? Be direct — start with 'I'."
          rows={3}
        />
      </label>
      <label className="story-field-label">Success criteria
        <textarea
          className="story-field-textarea"
          value={data.successCriteria}
          onChange={e => set('successCriteria', e.target.value)}
          placeholder="How did you define success for your part of the work?"
          rows={3}
        />
      </label>
    </div>
  );
}
