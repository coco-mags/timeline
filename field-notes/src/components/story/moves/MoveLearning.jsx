import React from 'react';

export default function MoveLearning({ data, onChange, prefilled }) {
  const set = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flow-fields">
      <div className="flow-field-group">
        <label className="flow-field-label">The learning</label>
        <p className="flow-field-sublabel">One sentence. A principle, not a reflection.</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '80px' }}
          value={data.text || ''}
          onChange={e => set('text', e.target.value)}
          placeholder="e.g. The real problem is always one layer below the first problem you see.&#10;e.g. The cheapest test is always better than the most elegant proposal."
        />
        {prefilled && (
          <p className="flow-field-prefill-note">Pre-filled from your learning log · edit freely</p>
        )}
        <p className="flow-field-hint">Over time, learnings from multiple projects stack into your professional philosophy.</p>
      </div>
    </div>
  );
}
