import React from 'react';
import { PHASES, phaseColor } from '../data/phases.js';

const CONTRIB_TYPES = [
  { key: 'noticed',   label: 'Noticed friction',   desc: 'Moments in the Observe phase',   color: '#7b9cc4', phase: 'observe'  },
  { key: 'proposed',  label: 'Proposed ideas',      desc: 'Moments in the Ideate phase',    color: '#b88fc2', phase: 'ideate'   },
  { key: 'decided',   label: 'Made decisions',      desc: 'Moments with documented choices', color: '#8aab7e', phase: null       },
  { key: 'tested',    label: 'Ran experiments',     desc: 'Moments in the Test phase',      color: '#d4856a', phase: 'test'     },
  { key: 'shipped',   label: 'Shipped changes',     desc: 'Moments in the Launch phase',    color: '#9c8060', phase: 'launch'   },
];

function countContribs(moments) {
  return {
    noticed:  moments.filter(m => m.phase === 'observe').length,
    proposed: moments.filter(m => m.phase === 'ideate').length,
    decided:  moments.filter(m => m.detail && m.detail.toLowerCase().includes('decided')).length,
    tested:   moments.filter(m => m.phase === 'test').length,
    shipped:  moments.filter(m => m.phase === 'launch').length,
  };
}

function buildSignature(counts, projectName) {
  const parts = [];
  if (counts.noticed  > 0) parts.push(`noticed ${counts.noticed} friction point${counts.noticed > 1 ? 's' : ''}`);
  if (counts.proposed > 0) parts.push(`proposed ${counts.proposed} idea${counts.proposed > 1 ? 's' : ''}`);
  if (counts.decided  > 0) parts.push(`made ${counts.decided} documented decision${counts.decided > 1 ? 's' : ''}`);
  if (counts.tested   > 0) parts.push(`ran ${counts.tested} experiment${counts.tested > 1 ? 's' : ''}`);
  if (counts.shipped  > 0) parts.push(`shipped ${counts.shipped} change${counts.shipped > 1 ? 's' : ''}`);
  if (parts.length === 0) return null;
  const last = parts.pop();
  return parts.length ? `${parts.join(', ')}, and ${last}` : last;
}

export default function ContribView({ moments, projectName }) {
  const counts   = countContribs(moments);
  const total    = moments.length;
  const max      = Math.max(...Object.values(counts), 1);
  const signature = buildSignature(counts, projectName);
  const phaseCounts = Object.fromEntries(PHASES.map(p => [p.id, moments.filter(m => m.phase === p.id).length]));

  return (
    <div className="contrib-view">
      {/* Header */}
      <div className="contrib-header">
        <div className="contrib-heading">Contribution overview</div>
        <div className="contrib-project-name">{projectName}</div>
      </div>

      {/* Stat strip */}
      <div className="contrib-stats">
        <div className="contrib-stat-card">
          <div className="contrib-stat-num">{total}</div>
          <div className="contrib-stat-label">Moments</div>
        </div>
        <div className="contrib-stat-card">
          <div className="contrib-stat-num">{[...new Set(moments.map(m => m.phase))].length}</div>
          <div className="contrib-stat-label">Phases covered</div>
        </div>
        <div className="contrib-stat-card">
          <div className="contrib-stat-num">{moments.flatMap(m => m.photos || []).length}</div>
          <div className="contrib-stat-label">Photos</div>
        </div>
        <div className="contrib-stat-card">
          <div className="contrib-stat-num">{moments.filter(m => (m.steps || []).length > 0).length}</div>
          <div className="contrib-stat-label">With process steps</div>
        </div>
      </div>

      <div className="contrib-body">
        {/* Left: contribution bars */}
        <div className="contrib-bars-section">
          <div className="contrib-section-label">What you did</div>
          {CONTRIB_TYPES.map(t => {
            const count = counts[t.key];
            const pct   = max > 0 ? (count / max) * 100 : 0;
            return (
              <div key={t.key} className="contrib-bar-row">
                <div className="contrib-bar-meta">
                  <span className="contrib-bar-label">{t.label}</span>
                  <span className="contrib-bar-desc">{t.desc}</span>
                </div>
                <div className="contrib-bar-right">
                  <div className="contrib-bar-track">
                    <div
                      className="contrib-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: t.color }}
                    />
                  </div>
                  <span className="contrib-bar-count" style={{ color: count > 0 ? t.color : 'var(--faint)' }}>
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: phase breakdown */}
        <div className="contrib-phase-section">
          <div className="contrib-section-label">Phase distribution</div>
          <div className="contrib-phase-chart">
            {PHASES.map(p => {
              const n   = phaseCounts[p.id] || 0;
              const pct = total > 0 ? Math.round((n / total) * 100) : 0;
              return (
                <div key={p.id} className="contrib-phase-row">
                  <div className="contrib-phase-dot" style={{ backgroundColor: p.color }} />
                  <span className="contrib-phase-name">{p.label}</span>
                  <div className="contrib-phase-track">
                    <div className="contrib-phase-fill" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                  </div>
                  <span className="contrib-phase-pct">{n > 0 ? `${pct}%` : '—'}</span>
                </div>
              );
            })}
          </div>

          {/* Signature */}
          {signature && (
            <div className="contrib-signature">
              <div className="contrib-signature-eyebrow">Your contribution</div>
              <p>On <strong>{projectName || 'this project'}</strong>, you {signature}. That's what UX practice looks like in the field.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
