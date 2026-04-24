import React from 'react';
import PullFromMoments from '../PullFromMoments.jsx';

export default function MoveProblem({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flow-fields">
      <div className="flow-field-group">
        <label className="flow-field-label">Problem name</label>
        <p className="flow-field-sublabel">Give the problem 2–4 words — like a diagnosis, not a feature request</p>
        <input
          className="flow-field-input"
          value={data.name || ''}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. The Fragmentation · The Copycat Trap · The No-Map Problem"
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">The evidence</label>
        <p className="flow-field-sublabel">What did you see, hear, or measure that proved this was real? Specific beats general.</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '70px' }}
          value={data.evidence || ''}
          onChange={e => set('evidence', e.target.value)}
          placeholder="e.g. Staff asked the same question 3 times per shift. Customers left before ordering."
        />
        <PullFromMoments
          moments={moments}
          phaseFilter={['observe']}
          onInsert={text => set('evidence', data.evidence ? data.evidence + '\n\n' + text : text)}
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">What everyone else was getting wrong <span className="flow-field-optional">optional</span></label>
        <p className="flow-field-sublabel">What did existing solutions miss?</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '60px' }}
          value={data.competitive || ''}
          onChange={e => set('competitive', e.target.value)}
          placeholder="e.g. Every competitor solved the symptom. Nobody solved the cause."
        />
        <p className="flow-field-hint">Shows strategic awareness — you looked at the landscape before designing.</p>
      </div>
    </div>
  );
}
