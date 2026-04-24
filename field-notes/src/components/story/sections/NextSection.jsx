import React from 'react';

export default function NextSection({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="story-section-fields">
      <label className="story-field-label">Future directions
        <textarea
          className="story-field-textarea"
          value={data.directions}
          onChange={e => set('directions', e.target.value)}
          placeholder="What would you explore next? List directions, not tasks. One per line works well."
          rows={4}
        />
      </label>
      <p className="story-field-helper">Optional — only include this section if you have genuine future ideas. It's okay to leave it out.</p>
    </div>
  );
}
