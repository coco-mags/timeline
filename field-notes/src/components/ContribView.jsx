import React from 'react';

const CONTRIB_TYPES = [
  { key: 'noticed',   label: 'Noticed',   color: '#7b9cc4' },
  { key: 'proposed',  label: 'Proposed',  color: '#b88fc2' },
  { key: 'decided',   label: 'Decided',   color: '#8aab7e' },
  { key: 'tested',    label: 'Tested',    color: '#d4856a' },
  { key: 'presented', label: 'Presented', color: '#9c8060' },
];

function countContribs(moments) {
  return {
    noticed:   moments.filter(m => m.phase === 'observe').length,
    proposed:  moments.filter(m => m.phase === 'ideate').length,
    decided:   moments.filter(m => m.detail && m.detail.toLowerCase().includes('decided')).length,
    tested:    moments.filter(m => m.phase === 'test').length,
    presented: moments.filter(m => m.phase === 'launch').length,
  };
}

function buildSignature(counts, projectName) {
  const parts = [];
  if (counts.noticed > 0) parts.push(`noticed ${counts.noticed} friction point${counts.noticed > 1 ? 's' : ''}`);
  if (counts.proposed > 0) parts.push(`proposed ${counts.proposed} idea${counts.proposed > 1 ? 's' : ''}`);
  if (counts.decided > 0) parts.push(`made ${counts.decided} documented decision${counts.decided > 1 ? 's' : ''}`);
  if (counts.tested > 0) parts.push(`ran ${counts.tested} test${counts.tested > 1 ? 's' : ''}`);
  if (counts.presented > 0) parts.push(`shipped ${counts.presented} change${counts.presented > 1 ? 's' : ''}`);

  if (parts.length === 0) return 'No contributions documented yet.';
  if (parts.length === 1) return `On ${projectName || 'this project'}, you ${parts[0]}.`;

  const last = parts.pop();
  return `On ${projectName || 'this project'}, you ${parts.join(', ')}, and ${last}. This is what UX practice looks like in the field.`;
}

export default function ContribView({ moments, projectName }) {
  const counts = countContribs(moments);
  const max = Math.max(...Object.values(counts), 1);
  const signature = buildSignature(counts, projectName);

  return (
    <div className="contrib-view">
      <div className="contrib-title">Your contributions</div>
      {CONTRIB_TYPES.map(t => (
        <div key={t.key} className="contrib-bar-row">
          <div className="contrib-bar-label">{t.label}</div>
          <div className="contrib-bar-track">
            <div
              className="contrib-bar-fill"
              style={{
                width: `${(counts[t.key] / max) * 100}%`,
                backgroundColor: t.color,
              }}
            />
          </div>
          <div className="contrib-bar-count">{counts[t.key]}</div>
        </div>
      ))}
      <div className="contrib-signature">{signature}</div>
    </div>
  );
}
