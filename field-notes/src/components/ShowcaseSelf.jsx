import React from 'react';
import { phaseColor, phaseLabel } from '../data/phases.js';

function moodNote(moment) {
  const phaseNotes = {
    observe: 'You were paying attention.',
    define: 'You named the real problem.',
    ideate: 'You generated options.',
    test: 'You ran an experiment.',
    launch: 'You shipped something.',
    reflect: 'You took stock.',
  };
  return phaseNotes[moment.phase] || '';
}

function buildUXSignature(project, profile) {
  const phases = [...new Set(project.moments.map(m => m.phase))];
  const name = profile?.name ? profile.name : 'You';
  return `${name} documented ${project.moments.length} moment${project.moments.length !== 1 ? 's' : ''} across this work — from ${phases[0] || 'observation'} through ${phases[phases.length - 1] || 'reflection'}. The evidence is here. The insight is yours. This is what UX practice looks like when it happens in the real world.`;
}

export default function ShowcaseSelf({ project, profile, onClose, storyTags = [], storyBlocks = [] }) {
  if (!project) return null;

  const photos = project.moments.flatMap(m => m.photos || []);
  const phases = [...new Set(project.moments.map(m => m.phase))];
  const uxSig = buildUXSignature(project, profile);
  const profileName = profile?.name;

  return (
    <div className="showcase-overlay">
      <div className="showcase-header">
        <div className="showcase-logo">field notes</div>
        <button className="showcase-close" onClick={onClose}>✕ Close</button>
      </div>
      <div className="showcase-body">
        {profileName && (
          <div className="showcase-eyebrow" style={{ marginBottom: '6px' }}>
            Your season in field notes, {profileName}
          </div>
        )}
        <div className="showcase-eyebrow">{project.name} · Your field notes</div>
        <h1 className="showcase-heading">Look at what you actually did.</h1>

        <div className="showcase-stats">
          <div className="showcase-stat">
            <div className="showcase-stat-num">{project.moments.length}</div>
            <div className="showcase-stat-label">Moments</div>
          </div>
          <div className="showcase-stat">
            <div className="showcase-stat-num">{phases.length}</div>
            <div className="showcase-stat-label">Phases</div>
          </div>
          <div className="showcase-stat">
            <div className="showcase-stat-num">{photos.length}</div>
            <div className="showcase-stat-label">Photos</div>
          </div>
        </div>

        <div className="showcase-moment-list">
          {project.moments.map(m => (
            <div key={m.id} className="showcase-moment-row">
              <div
                className="showcase-moment-dot"
                style={{ backgroundColor: phaseColor(m.phase) }}
              />
              <div className="showcase-moment-content">
                <div className="showcase-moment-title">{m.title}</div>
                <div className="showcase-moment-note">{moodNote(m)}</div>
                {m.sub && (
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{m.sub}</div>
                )}
                {(() => {
                  const momentBlocks = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id && t.momentId === m.id));
                  return momentBlocks.length > 0 ? (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {momentBlocks.map(b => (
                        <span key={b.id} style={{
                          fontSize: '8px', padding: '1px 6px', borderRadius: '8px',
                          backgroundColor: b.color, color: '#fff', fontWeight: 600,
                          letterSpacing: '0.5px'
                        }}>{b.label}</span>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          ))}
        </div>

        {(() => {
          const taggedBlocks = storyBlocks.filter(b => storyTags.some(t => t.blockId === b.id));
          return taggedBlocks.length > 0 ? (
            <div style={{ marginTop: '24px' }}>
              <div className="showcase-eyebrow" style={{ marginBottom: '12px' }}>The story</div>
              {taggedBlocks.map(b => {
                const tags = storyTags.filter(t => t.blockId === b.id);
                return (
                  <div key={b.id} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '8px', backgroundColor: b.color, color: '#fff', fontWeight: 700, letterSpacing: '1px', flexShrink: 0 }}>{b.label}</span>
                    </div>
                    {tags.map(tag => (
                      <div key={tag.momentId} style={{ paddingLeft: '12px', marginBottom: '6px' }}>
                        {tag.reason && <div style={{ fontSize: '12px', color: 'var(--ink2)', fontStyle: 'italic', lineHeight: 1.5 }}>"{tag.reason}"</div>}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : null;
        })()}

        {project.learning && (
          <div
            className="showcase-learning-block"
            style={{ borderLeftColor: project.color }}
          >
            <div className="showcase-learning-label">What you learned</div>
            <div className="showcase-learning-text">"{project.learning}"</div>
          </div>
        )}

        <div className="showcase-ux-block">
          <div className="showcase-ux-text">{uxSig}</div>
        </div>
      </div>
    </div>
  );
}
