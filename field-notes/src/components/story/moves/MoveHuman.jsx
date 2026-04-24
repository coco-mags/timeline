import React from 'react';
import PullFromMoments from '../PullFromMoments.jsx';

export default function MoveHuman({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flow-fields">
      <div className="flow-field-group">
        <label className="flow-field-label">Story title</label>
        <p className="flow-field-sublabel">Give this project a title with tension — a before implied in the words</p>
        <input
          className="flow-field-input"
          value={data.title || ''}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. The workflow we stopped pretending didn't exist"
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">Context line</label>
        <p className="flow-field-sublabel">Company · environment · year · your role — one scannable line</p>
        <input
          className="flow-field-input"
          value={data.contextLine || ''}
          onChange={e => set('contextLine', e.target.value)}
          placeholder="e.g. Coffee shop · Service design · 2025 · Shop worker"
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">The human situation</label>
        <p className="flow-field-sublabel">Who are they? What do they put up with? What does their day feel like?</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '90px' }}
          value={data.situation || ''}
          onChange={e => set('situation', e.target.value)}
          placeholder="e.g. Every shift, three staff members handled the same task three different ways. No one had named the problem yet."
        />
        <PullFromMoments
          moments={moments}
          phaseFilter={['observe']}
          onInsert={text => set('situation', data.situation ? data.situation + '\n\n' + text : text)}
        />
      </div>
    </div>
  );
}
