import React from 'react';
import PullFromMoments from '../PullFromMoments.jsx';

export default function MoveEvidence({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="flow-fields">
      <div className="flow-field-group">
        <label className="flow-field-label">Key data point or observation</label>
        <p className="flow-field-sublabel">Your sharpest piece of evidence in one line</p>
        <input
          className="flow-field-input"
          value={data.keyData || ''}
          onChange={e => set('keyData', e.target.value)}
          placeholder="e.g. 5 staff members · 5 different sequences · 0 written down anywhere"
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">What you observed directly</label>
        <p className="flow-field-sublabel">What you saw with your own eyes — not research, not theory. What you watched happen.</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '70px' }}
          value={data.observation || ''}
          onChange={e => set('observation', e.target.value)}
          placeholder="e.g. During the lunch rush I watched three different staff use the POS in three different orders. None of them were wrong. None of them were the same."
        />
        <PullFromMoments
          moments={moments}
          phaseFilter={['observe', 'define']}
          onInsert={text => set('observation', data.observation ? data.observation + '\n\n' + text : text)}
        />
      </div>

      <div className="flow-field-group">
        <label className="flow-field-label">Evidence artifacts</label>
        <p className="flow-field-sublabel">Photos, sketches, maps, competitive scans — describe what you have or link to it</p>
        <textarea
          className="flow-field-textarea"
          style={{ minHeight: '50px' }}
          value={data.artifactNote || ''}
          onChange={e => set('artifactNote', e.target.value)}
          placeholder="e.g. Photo of the three different POS setups · Sketch of the flow variations"
        />
        <p className="flow-field-hint">A before photo of the broken situation is worth 300 words of description.</p>
      </div>
    </div>
  );
}
