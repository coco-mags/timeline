import React from 'react';

function getStatus(moments) {
  const hasProblem = moments.some(m => m.phase === 'observe');
  const hasProcess = moments.length >= 3;
  const hasOutcome = moments.some(m => m.phase === 'launch');
  const hasDecisions = moments.some(m => m.detail && m.detail.toLowerCase().includes('not'));

  return { hasProblem, hasProcess, hasOutcome, hasDecisions };
}

const CHIP_STYLES = {
  green: {
    background: '#eaf3de',
    borderColor: '#c0dd97',
    color: '#27500a',
  },
  amber: {
    background: '#faeeda',
    borderColor: '#fac775',
    color: '#633806',
  },
  red: {
    background: '#fcebeb',
    borderColor: '#f7c1c1',
    color: '#a32d2d',
  },
};

function Chip({ label, ok, warn }) {
  const style = ok ? CHIP_STYLES.green : warn ? CHIP_STYLES.amber : CHIP_STYLES.red;
  return (
    <div
      className="validator-chip"
      style={{
        background: style.background,
        borderColor: style.borderColor,
        color: style.color,
      }}
    >
      <span style={{ fontSize: '9px' }}>{ok ? '✓' : warn ? '~' : '○'}</span>
      <span>{label}</span>
    </div>
  );
}

export default function StoryValidator({ moments }) {
  const { hasProblem, hasProcess, hasOutcome, hasDecisions } = getStatus(moments);
  const total = moments.length;

  return (
    <div className="story-validator">
      <Chip label="Problem" ok={hasProblem} warn={total > 0 && !hasProblem} />
      <Chip label="Process" ok={hasProcess} warn={total > 0 && total < 3} />
      <Chip label="Outcome" ok={hasOutcome} warn={total > 0 && !hasOutcome} />
      <Chip label="Decisions" ok={hasDecisions} warn={total > 0 && !hasDecisions} />
    </div>
  );
}
