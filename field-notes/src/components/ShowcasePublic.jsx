import React, { useState, useRef, useEffect } from 'react';
import { phaseColor, phaseLabel } from '../data/phases.js';
import StoryValidator from './StoryValidator.jsx';

const DEPTHS = ['Glance', 'Read', 'Deep'];

function GlanceContent({ project }) {
  const phases = [...new Set(project.moments.map(m => m.phase))];
  return (
    <div className="showcase-depth-content">
      <p>
        A practitioner-led UX initiative documenting {project.moments.length} moments
        across {phases.length} phase{phases.length !== 1 ? 's' : ''} of work —
        from initial observation through implementation.
      </p>
      {project.learning && (
        <p style={{ fontStyle: 'italic', color: 'var(--muted)' }}>
          Key learning: "{project.learning}"
        </p>
      )}
    </div>
  );
}

function ReadContent({ project, storyTags = [], storyBlocks = [] }) {
  const observed = project.moments.filter(m => m.phase === 'observe');
  const tested = project.moments.filter(m => m.phase === 'test');
  const launched = project.moments.filter(m => m.phase === 'launch');

  const renderMomentBadges = (m) => {
    const momentBlocks = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id && t.momentId === m.id));
    return momentBlocks.length > 0 ? (
      <span style={{ display: 'inline-flex', gap: '4px', marginLeft: '6px', verticalAlign: 'middle', flexWrap: 'wrap' }}>
        {momentBlocks.map(b => (
          <span key={b.id} style={{
            fontSize: '8px', padding: '1px 6px', borderRadius: '8px',
            backgroundColor: b.color, color: '#fff', fontWeight: 600,
            letterSpacing: '0.5px'
          }}>{b.label}</span>
        ))}
      </span>
    ) : null;
  };

  return (
    <div className="showcase-depth-content">
      {observed.length > 0 && (
        <>
          <h4>What was observed</h4>
          {observed.map(m => (
            <p key={m.id}><strong>{m.title}:</strong> {m.sub}{renderMomentBadges(m)}</p>
          ))}
        </>
      )}
      {tested.length > 0 && (
        <>
          <h4>What was tested</h4>
          {tested.map(m => (
            <p key={m.id}><strong>{m.title}:</strong> {m.sub}{renderMomentBadges(m)}</p>
          ))}
        </>
      )}
      {launched.length > 0 && (
        <>
          <h4>What shipped</h4>
          {launched.map(m => (
            <p key={m.id}><strong>{m.title}:</strong> {m.sub}{renderMomentBadges(m)}</p>
          ))}
        </>
      )}
      {project.learning && (
        <>
          <h4>What was learned</h4>
          <p style={{ fontStyle: 'italic' }}>"{project.learning}"</p>
        </>
      )}
    </div>
  );
}

function DeepContent({ project, storyTags = [], storyBlocks = [] }) {
  return (
    <div className="showcase-depth-content">
      {project.moments.map(m => {
        const momentBlocks = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id && t.momentId === m.id));
        return (
          <div key={m.id} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: phaseColor(m.phase), flexShrink: 0 }} />
              <strong style={{ fontSize: '12px', color: 'var(--ink)' }}>{m.title}</strong>
              <span style={{ fontSize: '9px', color: phaseColor(m.phase), textTransform: 'uppercase', letterSpacing: '1.5px' }}>{m.phase}</span>
              {momentBlocks.map(b => (
                <span key={b.id} style={{
                  fontSize: '8px', padding: '1px 6px', borderRadius: '8px',
                  backgroundColor: b.color, color: '#fff', fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>{b.label}</span>
              ))}
            </div>
            {m.sub && <p style={{ color: 'var(--muted)', fontSize: '11px', marginBottom: '6px' }}>{m.sub}</p>}
            {m.detail && <p>{m.detail}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default function ShowcasePublic({ project, onClose, voiceEdits, onVoiceEdit, storyTags = [], storyBlocks = [] }) {
  const [depth, setDepth] = useState('Glance');
  const phases = [...new Set(project.moments.map(m => m.phase))];

  if (!project) return null;

  const editKey = `project_${project.id}`;
  const edits = voiceEdits?.[editKey] || {};
  const editCount = Object.keys(edits).length;
  const totalSentences = project.moments.length + 3;
  const voicePct = Math.round((editCount / totalSentences) * 100);

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
            <span
              key={ph}
              className="showcase-phase-badge"
              style={{ backgroundColor: phaseColor(ph) }}
            >
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
          {depth === 'Read'   && <ReadContent project={project} storyTags={storyTags} storyBlocks={storyBlocks} />}
          {depth === 'Deep'   && <DeepContent project={project} storyTags={storyTags} storyBlocks={storyBlocks} />}
        </div>

        {project.learning && (
          <div
            className="showcase-learning-block"
            style={{ borderLeftColor: project.color, marginTop: '24px' }}
          >
            <div className="showcase-learning-label">Practitioner learning</div>
            <div className="showcase-learning-text">"{project.learning}"</div>
          </div>
        )}

        {(() => {
          const taggedBlocks = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id));
          return taggedBlocks.length > 0 ? (
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
