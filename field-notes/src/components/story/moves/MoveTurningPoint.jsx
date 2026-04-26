import React from 'react';
import FieldUnit from '../FieldUnit.jsx';
import { FIELD_EXAMPLES, FLOW_TIPS } from '../../../data/flowTips.js';

const MOVE_QUESTION  = "What did you suddenly understand that you couldn't unsee?";
const MOVE_RULE      = "This is the most memorable moment in any great portfolio. Write it like the moment it felt obvious.";
const MENTOR_MESSAGE = "That's your hinge. Everything before it was the setup. Everything after is the argument.";
const REQUIRED       = ['insight'];
const WHAT_WORKS     = FLOW_TIPS.turningPoint?.whatWorks;

export default function MoveTurningPoint({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  const filledCount = REQUIRED.filter(f => data[f]?.trim()).length;
  const isComplete  = filledCount === REQUIRED.length;
  const ex          = FIELD_EXAMPLES.turningPoint;

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
        label="The pivot insight"
        value={data.insight || ''}
        onChange={val => set('insight', val)}
        placeholder="e.g. We weren't fixing a training problem. We were fixing an information architecture problem."
        hint="The insight that reframed everything. Sharp, direct, one or two sentences. No hedging."
        examples={ex.insight}
        type="textarea"
        rows={3}
        required
        showPull
        moments={moments}
        phaseFilter={['define', 'ideate']}
        onInsert={text => set('insight', data.insight ? data.insight + '\n\n' + text : text)}
      />

      <FieldUnit
        label="What you chose not to do"
        value={data.rejected || ''}
        onChange={val => set('rejected', val)}
        placeholder="e.g. We chose not to retrain staff. That would have fixed the people, not the system."
        hint="The rejection proves judgment. It shows you saw the alternative and chose not to take it."
        examples={ex.rejected}
        type="textarea"
        rows={2}
      />
    </div>
  );
}
