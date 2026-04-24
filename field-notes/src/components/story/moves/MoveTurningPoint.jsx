import React from 'react';
import PullFromMoments from '../PullFromMoments.jsx';

export default function MoveTurningPoint({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flow-fields">
      <div className="flow-field-group">
        <label className="flow-field-label">The pivot insight</label>
        <p className="flow-field-sublabel">The insight that reframed everything. Sharp, direct, present tense.</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '80px' }}
          value={data.insight || ''}
          onChange={e => set('insight', e.target.value)}
          placeholder="e.g. We weren't fixing a training problem. We were fixing an information architecture problem."
        />
        <PullFromMoments
          moments={moments}
          phaseFilter={['define', 'ideate']}
          onInsert={text => set('insight', data.insight ? data.insight + '\n\n' + text : text)}
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">What you chose not to do</label>
        <p className="flow-field-sublabel">The path you rejected — and why it mattered that you rejected it.</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '60px' }}
          value={data.rejected || ''}
          onChange={e => set('rejected', e.target.value)}
          placeholder="e.g. We chose not to retrain staff. That would have fixed the people, not the system."
        />
        <p className="flow-field-hint">The rejection proves judgment. It shows you saw the alternative and chose not to take it.</p>
      </div>
    </div>
  );
}
