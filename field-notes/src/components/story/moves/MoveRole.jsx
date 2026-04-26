import React from 'react';
import FieldUnit from '../FieldUnit.jsx';
import { FIELD_EXAMPLES, FLOW_TIPS } from '../../../data/flowTips.js';

const MOVE_QUESTION  = "What did YOU specifically own, decide, and advocate for?";
const MOVE_RULE      = "Active verbs show agency. 'I decided' is stronger than 'I was responsible for.' Your success criteria show you designed with a destination.";
const MENTOR_MESSAGE = "Your role is clear. Now show how you think — decision by decision.";
const REQUIRED       = ['contribution'];
const WHAT_WORKS     = FLOW_TIPS.role?.whatWorks;

export default function MoveRole({ data, onChange }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  const filledCount = REQUIRED.filter(f => data[f]?.trim()).length;
  const isComplete  = filledCount === REQUIRED.length;
  const ex          = FIELD_EXAMPLES.role;

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
        label="Your specific contribution"
        value={data.contribution || ''}
        onChange={val => set('contribution', val)}
        placeholder="e.g. I mapped the current flow without being asked. I proposed the fix. I ran the pilot shift."
        hint="Start with I. Use active verbs: I led / I proposed / I decided / I facilitated / I pushed for"
        examples={ex.contribution}
        type="textarea"
        rows={3}
        required
      />

      <FieldUnit
        label="What success looked like"
        value={data.successCriteria || ''}
        onChange={val => set('successCriteria', val)}
        placeholder="e.g. Staff would stop needing reminders after the first week. Onboarding new staff would take half the time."
        hint="Define this before the outcome — it shows you designed with a destination"
        examples={ex.successCriteria}
        type="textarea"
        rows={2}
      />
    </div>
  );
}
