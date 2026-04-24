import React, { useState } from 'react';
import { phaseColor, phaseLabel } from '../data/phases.js';
import StoryValidator from './StoryValidator.jsx';

const DEPTHS = ['Glance', 'Read', 'Deep', 'Story'];

// ── Fallback content helpers ───────────────────────────────────────────────────

function fallback(sfVal, momentVal) {
  return (sfVal && sfVal.trim()) ? sfVal : (momentVal || '');
}

// ── Depth views ────────────────────────────────────────────────────────────────

function GlanceContent({ project }) {
  const sf     = project.storyFlow;
  const phases = [...new Set(project.moments.map(m => m.phase))];
  const opening = fallback(sf?.human?.situation, null) ||
    project.moments.find(m => m.phase === 'observe')?.detail || '';

  return (
    <div className="showcase-depth-content">
      <p>
        {opening || (
          <>
            A practitioner-led UX initiative documenting {project.moments.length} moment
            {project.moments.length !== 1 ? 's' : ''} across {phases.length} phase
            {phases.length !== 1 ? 's' : ''} of work — from initial observation through implementation.
          </>
        )}
      </p>
      {project.learning && (
        <p style={{ fontStyle: 'italic', color: 'var(--muted)', marginTop: '12px' }}>
          Key learning: "{project.learning}"
        </p>
      )}
    </div>
  );
}

function ReadContent({ project, storyTags = [], storyBlocks = [] }) {
  const observed = project.moments.filter(m => m.phase === 'observe');
  const tested   = project.moments.filter(m => m.phase === 'test');
  const launched = project.moments.filter(m => m.phase === 'launch');

  const renderBadges = (m) => {
    const blocks = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id && t.momentId === m.id));
    return blocks.length > 0 ? (
      <span style={{ display: 'inline-flex', gap: '4px', marginLeft: '6px', verticalAlign: 'middle' }}>
        {blocks.map(b => (
          <span key={b.id} style={{
            fontSize: '8px', padding: '1px 6px', borderRadius: '8px',
            backgroundColor: b.color, color: '#fff', fontWeight: 600, letterSpacing: '0.5px',
          }}>{b.label}</span>
        ))}
      </span>
    ) : null;
  };

  return (
    <div className="showcase-depth-content">
      {observed.length > 0 && (<><h4>What was observed</h4>{observed.map(m => <p key={m.id}><strong>{m.title}:</strong> {m.sub}{renderBadges(m)}</p>)}</>)}
      {tested.length   > 0 && (<><h4>What was tested</h4>{tested.map(m => <p key={m.id}><strong>{m.title}:</strong> {m.sub}{renderBadges(m)}</p>)}</>)}
      {launched.length > 0 && (<><h4>What shipped</h4>{launched.map(m => <p key={m.id}><strong>{m.title}:</strong> {m.sub}{renderBadges(m)}</p>)}</>)}
      {project.learning && (<><h4>What was learned</h4><p style={{ fontStyle: 'italic' }}>"{project.learning}"</p></>)}
    </div>
  );
}

function DeepContent({ project, storyTags = [], storyBlocks = [] }) {
  return (
    <div className="showcase-depth-content">
      {project.moments.map(m => {
        const blocks = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id && t.momentId === m.id));
        return (
          <div key={m.id} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: phaseColor(m.phase), flexShrink: 0 }} />
              <strong style={{ fontSize: '12px', color: 'var(--ink)' }}>{m.title}</strong>
              <span style={{ fontSize: '9px', color: phaseColor(m.phase), textTransform: 'uppercase', letterSpacing: '1.5px' }}>{m.phase}</span>
              {blocks.map(b => (
                <span key={b.id} style={{ fontSize: '8px', padding: '1px 6px', borderRadius: '8px', backgroundColor: b.color, color: '#fff', fontWeight: 600, letterSpacing: '0.5px' }}>{b.label}</span>
              ))}
            </div>
            {m.sub    && <p style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: '6px' }}>{m.sub}</p>}
            {m.detail && <p>{m.detail}</p>}
          </div>
        );
      })}
    </div>
  );
}

function StoryContent({ project }) {
  const sf = project.storyFlow || {};
  const firstObserve = project.moments.find(m => m.phase === 'observe');
  const lastLaunch   = project.moments.filter(m => m.phase === 'launch').at(-1);

  const title       = fallback(sf.human?.title,        project.name);
  const contextLine = fallback(sf.human?.contextLine,  '');
  const situation   = fallback(sf.human?.situation,    firstObserve?.detail || '');
  const probName    = fallback(sf.problem?.name,       '');
  const evidence    = fallback(sf.problem?.evidence,   '');
  const observation = fallback(sf.evidence?.observation, '');
  const keyData     = fallback(sf.evidence?.keyData,   '');
  const insight     = fallback(sf.turningPoint?.insight, '');
  const contribution = fallback(sf.role?.contribution, '');
  const successCrit  = fallback(sf.role?.successCriteria, '');
  const decisions   = Array.isArray(sf.decisions) ? sf.decisions.filter(d => d.name?.trim()) : [];
  const changed     = fallback(sf.outcome?.changed,    lastLaunch?.detail || '');
  const honest      = fallback(sf.outcome?.honest,     '');
  const learning    = fallback(sf.learning?.text,      project.learning || '');

  return (
    <div className="showcase-story-content">

      {/* 1. Title */}
      <h1 className="sc-story-title">{title}</h1>
      {contextLine && <p className="sc-story-eyebrow">{contextLine}</p>}

      {/* 2-3. The human */}
      {situation && (
        <div className="sc-story-section">
          <div className="sc-story-section-divider" />
          <p className="sc-story-opening">{situation}</p>
        </div>
      )}

      {/* 4-6. Problem + evidence */}
      {probName && (
        <div className="sc-story-section">
          <div className="sc-story-section-label">The problem</div>
          <h2 className="sc-story-problem-name">{probName}</h2>
          {evidence && <p className="sc-story-body">{evidence}</p>}
          {(observation || keyData) && (
            <p className="sc-story-body">{[keyData, observation].filter(Boolean).join(' — ')}</p>
          )}
        </div>
      )}

      {/* 8. Pull quote */}
      {insight && (
        <div className="sc-story-pullquote">
          <p>"{insight}"</p>
        </div>
      )}

      {/* 9. Role */}
      {(contribution || successCrit) && (
        <div className="sc-story-section">
          <div className="sc-story-section-label">Role</div>
          {contribution && <p className="sc-story-body">{contribution}</p>}
          {successCrit  && <p className="sc-story-body sc-story-muted">{successCrit}</p>}
        </div>
      )}

      {/* 10. Decisions */}
      {decisions.length > 0 && (
        <div className="sc-story-section">
          <div className="sc-story-section-label">The decisions</div>
          {decisions.map((d, i) => (
            <div key={i} className="sc-decision-block">
              <p className="sc-decision-name">{d.name}</p>
              {d.built    && <p className="sc-story-body">{d.built}</p>}
              {d.rejected && (
                <div className="sc-decision-rejected">
                  <span className="sc-decision-rejected-label">Decided not to:</span> {d.rejected}
                </div>
              )}
              {d.impact   && <p className="sc-story-body sc-story-muted">{d.impact}</p>}
            </div>
          ))}
        </div>
      )}

      {/* 11-12. Outcome + honest */}
      {changed && (
        <div className="sc-story-section">
          <div className="sc-story-section-label">The outcome</div>
          <p className="sc-story-body">{changed}</p>
          {honest && (
            <div className="sc-honest-block">
              <p>{honest}</p>
            </div>
          )}
        </div>
      )}

      {/* 13. Learning */}
      {learning && (
        <div className="sc-learning-block">
          <div className="sc-story-section-label sc-learning-label">The learning</div>
          <p className="sc-learning-text">"{learning}"</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ShowcasePublic({ project, onClose, voiceEdits, onVoiceEdit, storyTags = [], storyBlocks = [] }) {
  const sf = project?.storyFlow;
  const hasStoryContent = sf && (sf.human?.title || sf.human?.situation || sf.problem?.name);

  // Default to Story tab if storyFlow has content, else Glance
  const [depth, setDepth] = useState(hasStoryContent ? 'Story' : 'Glance');

  const phases = [...new Set(project.moments.map(m => m.phase))];

  if (!project) return null;

  const editKey      = `project_${project.id}`;
  const edits        = voiceEdits?.[editKey] || {};
  const editCount    = Object.keys(edits).length;
  const totalSentences = project.moments.length + 3;
  const voicePct     = Math.round((editCount / totalSentences) * 100);

  return (
    <div className="showcase-overlay">
      <div className="showcase-header">
        <div className="showcase-logo">field notes</div>
        <button className="showcase-close" onClick={onClose}>✕ Close</button>
      </div>
      <div className="showcase-body">
        <div className="showcase-eyebrow">Portfolio</div>
        <h1 className="showcase-heading">{project.name}</h1>

        <div className="showcase-tags">
          {phases.map(ph => (
            <span key={ph} className="showcase-phase-badge" style={{ backgroundColor: phaseColor(ph) }}>
              {phaseLabel(ph)}
            </span>
          ))}
          <span className="showcase-tag">{project.moments.length} moments</span>
          {project.moments.some(m => m.photos?.length) && (
            <span className="showcase-tag">Photo documentation</span>
          )}
        </div>

        <StoryValidator moments={project.moments} />

        <div style={{ marginTop: '20px' }}>
          <div className="depth-selector">
            {DEPTHS.map(d => (
              <button
                key={d}
                className={'depth-btn' + (depth === d ? ' active' : '')}
                onClick={() => setDepth(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {depth === 'Glance' && <GlanceContent project={project} />}
          {depth === 'Read'   && <ReadContent   project={project} storyTags={storyTags} storyBlocks={storyBlocks} />}
          {depth === 'Deep'   && <DeepContent   project={project} storyTags={storyTags} storyBlocks={storyBlocks} />}
          {depth === 'Story'  && <StoryContent  project={project} />}
        </div>

        {project.learning && depth !== 'Story' && (
          <div className="showcase-learning-block" style={{ borderLeftColor: project.color, marginTop: '24px' }}>
            <div className="showcase-learning-label">Practitioner learning</div>
            <div className="showcase-learning-text">"{project.learning}"</div>
          </div>
        )}

        {(() => {
          const taggedBlocks = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id));
          return taggedBlocks.length > 0 && depth !== 'Story' ? (
            <div style={{ marginTop: '24px' }}>
              <div className="showcase-eyebrow" style={{ marginBottom: '12px' }}>The story</div>
              {taggedBlocks.map(b => {
                const tag = storyTags.find(t => t.blockId === b.id);
                return (
                  <div key={b.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '8px', backgroundColor: b.color, color: '#fff', fontWeight: 700, letterSpacing: '1px', flexShrink: 0, marginTop: '2px' }}>{b.label}</span>
                    {tag.reason && <span style={{ fontSize: '12px', color: 'var(--ink2)', fontStyle: 'italic', lineHeight: 1.5 }}>"{tag.reason}"</span>}
                  </div>
                );
              })}
            </div>
          ) : null;
        })()}

        <div className="voice-indicator">
          <span>{voicePct}% your voice</span>
        </div>
      </div>
    </div>
  );
}
