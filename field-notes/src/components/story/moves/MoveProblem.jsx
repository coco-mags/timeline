import React from 'react';
import FieldUnit from '../FieldUnit.jsx';
import { FIELD_EXAMPLES, FLOW_TIPS } from '../../../data/flowTips.js';

const MOVE_QUESTION  = "What would you call this problem if you had to diagnose it in four words?";
const MOVE_RULE      = "A named problem is a diagnosed problem. 'The Fragmentation' is unforgettable. 'We identified several issues' is not.";
const MENTOR_MESSAGE = "Named. Now show the evidence that made it undeniable.";
const REQUIRED       = ['name', 'evidence'];
const WHAT_WORKS     = FLOW_TIPS.problem?.whatWorks;

export default function MoveProblem({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  const filledCount = REQUIRED.filter(f => data[f]?.trim()).length;
  const isComplete  = filledCount === REQUIRED.length;
  const ex          = FIELD_EXAMPLES.problem;

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
        label="Problem name"
        value={data.name || ''}
        onChange={val => set('name', val)}
        placeholder="e.g. The Fragmentation · The Copycat Trap · The Confidence Gap"
        hint="2–4 words that name it like a diagnosis — sharp enough that someone would recognise it"
        examples={ex.name}
        type="input"
        required
      />

      <FieldUnit
        label="The evidence"
        value={data.evidence || ''}
        onChange={val => set('evidence', val)}
        placeholder="What did you see, hear, or measure that proved this was real?"
        hint="Specific beats general. Numbers, observations, or direct quotes — any of these."
        examples={ex.evidence}
        type="textarea"
        rows={3}
        required
        showPull
        moments={moments}
        phaseFilter={['observe']}
        onInsert={text => set('evidence', data.evidence ? data.evidence + '\n\n' + text : text)}
      />

      <FieldUnit
        label="What everyone else got wrong"
        value={data.competitive || ''}
        onChange={val => set('competitive', val)}
        placeholder="e.g. Every competitor solved the symptom. Nobody solved the cause."
        hint="Optional — but it shows strategic awareness. You looked at the landscape before designing."
        examples={ex.competitive}
        type="textarea"
        rows={2}
      />
    </div>
  );
}
