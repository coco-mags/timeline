import React from 'react';
import FieldUnit from '../FieldUnit.jsx';
import { FIELD_EXAMPLES, FLOW_TIPS } from '../../../data/flowTips.js';

const MOVE_QUESTION  = "What do you now understand that you didn't before? Write it like a principle.";
const MOVE_RULE      = "Short enough to remember. Specific enough to be yours. Honest enough to be useful.";
const MENTOR_MESSAGE = "Your story is complete. Generate the showcase when you're ready.";
const WHAT_WORKS     = FLOW_TIPS.learning?.whatWorks;
const REQUIRED       = ['text'];

export default function MoveLearning({ data, onChange, prefilled }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  const filledCount = REQUIRED.filter(f => data[f]?.trim()).length;
  const isComplete  = filledCount === REQUIRED.length;
  const ex          = FIELD_EXAMPLES.learning;

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
        label="The learning"
        value={data.text || ''}
        onChange={val => set('text', val)}
        placeholder="e.g. The real problem is always one layer below the first problem you see."
        hint={prefilled ? 'Pre-filled from your learning log · edit freely' : 'One principle. The thing you now carry into every project after this one.'}
        examples={ex.text}
        type="textarea"
        rows={4}
        required
      />
    </div>
  );
}
