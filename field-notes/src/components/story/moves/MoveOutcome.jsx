import React from 'react';
import FieldUnit from '../FieldUnit.jsx';
import { FIELD_EXAMPLES, FLOW_TIPS } from '../../../data/flowTips.js';

const MOVE_QUESTION  = "What actually changed — and what is the honest part?";
const MOVE_RULE      = "You don't need a dashboard. 'Nobody needed reminding after day 3' is a real outcome. The honest part makes you trusted. Never skip it.";
const MENTOR_MESSAGE = "Almost done. Close with what you learned. One principle. The thing you now carry.";
const WHAT_WORKS     = FLOW_TIPS.outcome?.whatWorks;
const REQUIRED       = ['changed'];

export default function MoveOutcome({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  const filledCount = REQUIRED.filter(f => data[f]?.trim()).length;
  const isComplete  = filledCount === REQUIRED.length;
  const ex          = FIELD_EXAMPLES.outcome;

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
        label="What observably changed"
        value={data.changed || ''}
        onChange={val => set('changed', val)}
        placeholder="e.g. After the change, staff used the same sequence every time. New staff onboarding dropped from a full shift to a half shift."
        hint="Specific and honest. Observable signals count as much as numbers."
        examples={ex.changed}
        type="textarea"
        rows={4}
        required
        showPull
        moments={moments}
        phaseFilter={['launch', 'reflect']}
        onInsert={text => set('changed', data.changed ? data.changed + '\n\n' + text : text)}
      />

      <FieldUnit
        label="The honest part"
        value={data.honest || ''}
        onChange={val => set('honest', val)}
        placeholder="e.g. The system works well for the morning crew. The evening crew reverted after two weeks — we never solved the handover gap."
        hint="This paragraph makes you more credible than any polished success claim"
        examples={ex.honest}
        type="textarea"
        rows={3}
      />
    </div>
  );
}
