import React from 'react';
import { FLOW_MOVES } from '../../data/flowDefinitions.js';
import { calcFlowCompleteness, getMentorMessage, getMoveStatus } from '../../hooks/useStoryFlow.js';

export default function FlowNav({ activeMoveId, onSelect, storyFlow, onGenerateShowcase }) {
  const completeness = calcFlowCompleteness(storyFlow);
  const mentorMsg    = getMentorMessage(storyFlow);
  const canGenerate  = completeness >= 50;

  return (
    <div className="flow-nav">
      <div className="flow-nav-top-label">Your story</div>

      <nav className="flow-nav-list">
        {FLOW_MOVES.map(move => {
          const status = getMoveStatus(move.id, storyFlow);
          const isActive = move.id === activeMoveId;

          return (
            <button
              key={move.id}
              className={
                'flow-nav-item' +
                (isActive ? ' active' : '') +
                (move.priority === 'must-have' && status === 'empty' ? ' must-empty' : '')
              }
              onClick={() => onSelect(move.id)}
            >
              <span className="flow-nav-number">{move.number}</span>
              <span className="flow-nav-name">{move.name}</span>
              <span className={'flow-nav-dot ' + status} />
            </button>
          );
        })}
      </nav>

      <div className="flow-nav-footer">
        <div className="flow-nav-bar-row">
          <div className="flow-completeness-bar">
            <div className="flow-completeness-fill" style={{ width: `${completeness}%` }} />
          </div>
          <span className="flow-completeness-pct">{completeness}%</span>
        </div>

        {mentorMsg && (
          <p className="flow-mentor-msg">{mentorMsg}</p>
        )}

        <button
          className="flow-generate-btn"
          onClick={canGenerate ? onGenerateShowcase : undefined}
          disabled={!canGenerate}
          title={!canGenerate ? 'Complete the must-have sections first' : undefined}
        >
          Generate showcase
        </button>
      </div>
    </div>
  );
}
