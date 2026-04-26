import React from 'react';
import FieldUnit from '../FieldUnit.jsx';
import { FIELD_EXAMPLES, FLOW_TIPS } from '../../../data/flowTips.js';

const MOVE_QUESTION  = "Who is the real person suffering here — before your work exists?";
const MOVE_RULE      = "Never start with 'I was tasked with...' — start with the person who has the problem.";
const MENTOR_MESSAGE = "Good start. Now give the problem a name sharp enough to diagnose it.";
const REQUIRED       = ['title', 'situation'];
const WHAT_WORKS     = FLOW_TIPS.human?.whatWorks;

export default function MoveHuman({ data, onChange, moments }) {
  const set = (field, val) => onChange({ ...data, [field]: val });
  const filledCount = REQUIRED.filter(f => data[f]?.trim()).length;
  const isComplete  = filledCount === REQUIRED.length;
  const ex          = FIELD_EXAMPLES.human;

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
        label="Story title"
        value={data.title || ''}
        onChange={val => set('title', val)}
        placeholder="e.g. The workflow we stopped pretending didn't exist"
        hint="A title that implies the before — something was wrong before this work existed"
        examples={ex.title}
        type="input"
        required
      />

      <FieldUnit
        label="Context line"
        value={data.contextLine || ''}
        onChange={val => set('contextLine', val)}
        placeholder="e.g. Coffee shop · Service design · 2025 · Shop worker"
        hint="Separate items with · (option+8 on Mac) — each becomes its own pill tag in the portfolio view"
        examples={ex.contextLine}
        type="input"
      />

      <FieldUnit
        label="The human situation"
        value={data.situation || ''}
        onChange={val => set('situation', val)}
        placeholder="Who are they? What do they put up with? What does their day feel like before your work?"
        hint="Start with the person, not the product. Present tense. No jargon."
        examples={ex.situation}
        type="textarea"
        rows={4}
        required
        showPull
        moments={moments}
        phaseFilter={['observe']}
        onInsert={text => set('situation', data.situation ? data.situation + '\n\n' + text : text)}
      />
    </div>
  );
}
