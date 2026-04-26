import React from 'react';
import FieldUnit from '../FieldUnit.jsx';
import { FIELD_EXAMPLES, FLOW_TIPS } from '../../../data/flowTips.js';

const MOVE_QUESTION  = "What can you show — not just say — that proves this problem was real?";
const MOVE_RULE      = "Numbers if you have them. Observations if you don't. Photos, sketches, or competitive maps if you captured them. Specificity is credibility.";
const MENTOR_MESSAGE = "The evidence is there. Now find the moment the direction became obvious.";
const REQUIRED       = ['keyData', 'observation'];
const WHAT_WORKS     = FLOW_TIPS.evidence?.whatWorks;

export default function MoveEvidence({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  const filledCount = REQUIRED.filter(f => data[f]?.trim()).length;
  const isComplete  = filledCount === REQUIRED.length;
  const ex          = FIELD_EXAMPLES.evidence;

  return (
    <div className="move-editor">
      <p className="move-question">{MOVE_QUESTION}</p>
      {WHAT_WORKS && <p className="move-what-works">{WHAT_WORKS}</p>}

      <div className="move-rule-card">
        <div className="move-rule-label">the rule</div>
        <p className="move-rule-text">{MOVE_RULE}</p>
      </div>

      {isComplete && <p className="move-mentor-msg">{MENTOR_MESSAGE}</p>}

      <FieldUnit
        label="Key data point"
        value={data.keyData || ''}
        onChange={val => set('keyData', val)}
        placeholder="e.g. 5 staff members · 5 different sequences · 0 written down anywhere"
        hint="Your sharpest piece of evidence in one line — a number, a ratio, a stark contrast"
        examples={ex.keyData}
        type="input"
        required
      />

      <FieldUnit
        label="What you observed directly"
        value={data.observation || ''}
        onChange={val => set('observation', val)}
        placeholder="What you saw with your own eyes — not research, not theory. What you watched happen."
        hint="First person, past tense. The more specific the moment, the more credible the problem."
        examples={ex.observation}
        type="textarea"
        rows={4}
        required
        showPull
        moments={moments}
        phaseFilter={['observe', 'define']}
        onInsert={text => set('observation', data.observation ? data.observation + '\n\n' + text : text)}
      />

      <FieldUnit
        label="Evidence artifacts"
        value={data.artifactNote || ''}
        onChange={val => set('artifactNote', val)}
        placeholder="e.g. Photo of the three different POS setups · Sketch of the flow variations"
        hint="Optional — a before photo of the broken situation is worth 300 words of description"
        examples={ex.artifactNote}
        type="textarea"
        rows={2}
      />
    </div>
  );
}
