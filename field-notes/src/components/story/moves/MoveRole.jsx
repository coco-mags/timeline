import React from 'react';

export default function MoveRole({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flow-fields">
      <div className="flow-field-group">
        <label className="flow-field-label">Your specific contribution</label>
        <p className="flow-field-sublabel">Start with I. Use active verbs: I led / I proposed / I decided / I facilitated / I pushed for</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '65px' }}
          value={data.contribution || ''}
          onChange={e => set('contribution', e.target.value)}
          placeholder="e.g. I mapped the current flow without being asked. I proposed the fix. I ran the pilot shift."
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">What success looked like</label>
        <p className="flow-field-sublabel">Before you started — what observable signal would tell you it worked?</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '60px' }}
          value={data.successCriteria || ''}
          onChange={e => set('successCriteria', e.target.value)}
          placeholder="e.g. Staff would stop needing reminders after the first week. Onboarding new staff would take half the time."
        />
        <p className="flow-field-hint">Defining success before you start means you can report on it honestly at the end.</p>
      </div>
    </div>
  );
}
