import React from 'react';

function getStatus(moments) {
  const hasProblem = moments.some(m => m.phase === 'observe');
  const hasProcess = moments.length >= 3;
  const hasOutcome = moments.some(m => m.phase === 'launch');
  const hasDecisions = moments.some(m => m.detail && m.detail.toLowerCase().includes('not'));

  return { hasProblem, hasProcess, hasOutcome, hasDecisions };
}

const CHIP_STYLES = {
  green: { background: '#eaf3de', color: '#2a5008' },
  amber: { background: '#faeeda', color: '#5a3000' },
  red:   { background: '#fcebeb', color: '#952020' },
};

function Chip({ label, ok, warn }) {
  const style = ok ? CHIP_STYLES.green : warn ? CHIP_STYLES.amber : CHIP_STYLES.red;
  return (
    <div className="validator-chip" style={{ background: style.background, color: style.color }}>
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
