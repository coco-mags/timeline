import React from 'react';
import PullFromMoments from '../PullFromMoments.jsx';

export default function MoveOutcome({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flow-fields">
      <div className="flow-field-group">
        <label className="flow-field-label">What observably changed</label>
        <p className="flow-field-sublabel">Specific and honest. Observable signals count as much as numbers.</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '70px' }}
          value={data.changed || ''}
          onChange={e => set('changed', e.target.value)}
          placeholder="e.g. After the change, staff used the same sequence every time. New staff onboarding dropped from a full shift to a half shift."
        />
        <PullFromMoments
          moments={moments}
          phaseFilter={['launch', 'reflect']}
          onInsert={text => set('changed', data.changed ? data.changed + '\n\n' + text : text)}
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">The honest part</label>
        <p className="flow-field-sublabel">What didn't ship? What was harder than expected? What remains unresolved?</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '65px' }}
          value={data.honest || ''}
          onChange={e => set('honest', e.target.value)}
          placeholder="e.g. The system works well for the morning crew. The evening crew reverted after two weeks — we never solved the handover gap."
        />
        <p className="flow-field-hint">This paragraph makes you more credible than any polished success claim.</p>
      </div>
    </div>
  );
}
