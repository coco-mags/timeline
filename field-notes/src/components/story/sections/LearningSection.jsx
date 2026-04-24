import React from 'react';

export default function LearningSection({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  return (
    <div className="story-section-fields">
      <label className="story-field-label">The lesson
        <textarea
          className="story-field-textarea story-field-textarea--lg"
          value={data.text}
          onChange={e => set('text', e.target.value)}
          placeholder="What principle or realization would you carry into the next project? Make it timeless and quotable."
          rows={5}
        />
      </label>
      <p className="story-field-helper">This will be displayed large and prominently. Write it as a standalone statement, not a bullet list.</p>
    </div>
  );
}
