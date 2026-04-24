import React from 'react';
import { FLOW_MOVES, MOVE_BY_ID } from '../../data/flowDefinitions.js';
import MoveHuman        from './moves/MoveHuman.jsx';
import MoveProblem      from './moves/MoveProblem.jsx';
import MoveEvidence     from './moves/MoveEvidence.jsx';
import MoveTurningPoint from './moves/MoveTurningPoint.jsx';
import MoveRole         from './moves/MoveRole.jsx';
import MoveDecisions    from './moves/MoveDecisions.jsx';
import MoveOutcome      from './moves/MoveOutcome.jsx';
import MoveLearning     from './moves/MoveLearning.jsx';

const MOVE_COMPONENTS = {
  human:        MoveHuman,
  problem:      MoveProblem,
  evidence:     MoveEvidence,
  turningPoint: MoveTurningPoint,
  role:         MoveRole,
  decisions:    MoveDecisions,
  outcome:      MoveOutcome,
  learning:     MoveLearning,
};

const PRIORITY_LABELS = {
  'must-have':    'Must have',
  'recommended':  'Strongly recommended',
};

export default function FlowEditor({ activeMoveId, storyFlow, onChange, moments, learningPrefilled, onNav }) {
  const move      = MOVE_BY_ID[activeMoveId];
  const Component = MOVE_COMPONENTS[activeMoveId];
  const moveIndex = FLOW_MOVES.findIndex(m => m.id === activeMoveId);
  const prevMove  = FLOW_MOVES[moveIndex - 1];
  const nextMove  = FLOW_MOVES[moveIndex + 1];

  if (!move || !Component) return null;

  const data = activeMoveId === 'decisions'
    ? (storyFlow.decisions || [])
    : (storyFlow[activeMoveId] || {});

  const handleChange = (val) => onChange(activeMoveId, val);

  return (
    <div className="flow-editor">
      <div className="flow-move-header">
        <span className="flow-move-number">{move.number}</span>
        <div className="flow-move-header-right">
          <h2 className="flow-move-name">{move.name}</h2>
          <span className={'flow-priority-badge ' + move.priority.replace('-', '_')}>
            {PRIORITY_LABELS[move.priority] || move.priority}
          </span>
        </div>
      </div>

      <p className="flow-guidance-q">{move.guidanceQuestion}</p>

      <div className="flow-rule-callout">
        {move.rule}
      </div>

      <Component
        data={data}
        onChange={handleChange}
        moments={moments}
        prefilled={activeMoveId === 'learning' ? learningPrefilled : undefined}
      />

      <div className="flow-nav-row">
        {prevMove ? (
          <button className="flow-nav-prev" onClick={() => onNav(prevMove.id)}>
            ← {prevMove.name}
          </button>
        ) : <span />}
        {nextMove && (
          <button className="flow-nav-next" onClick={() => onNav(nextMove.id)}>
            {nextMove.name} →
          </button>
        )}
      </div>
    </div>
  );
}
