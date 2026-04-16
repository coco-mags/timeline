import React, { useState } from 'react';
import { phaseColor, phaseLabel } from '../data/phases.js';

export default function StoryBlocksPanel({
  blocks, storyTags, moments, onDropMoment, onSaveReason, onRemoveTag,
}) {
  const [dragOverBlockId, setDragOverBlockId] = useState(null);

  return (
    <div className="story-blocks-view">
      <div className="contrib-title" style={{ marginBottom: 20 }}>Story blocks</div>

      <div className="story-news-grid">
        {blocks.map(b => {
          const blockTags = storyTags.filter(t => t.blockId === b.id);

          return (
            <article
              key={b.id}
              className={'story-news-card' + (dragOverBlockId === b.id ? ' drag-over' : '')}
              onDragOver={(e) => { e.preventDefault(); setDragOverBlockId(b.id); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverBlockId(null); }}
              onDrop={(e) => {
                e.preventDefault();
                const mid = parseInt(e.dataTransfer.getData('momentId'), 10);
                if (mid) onDropMoment(b.id, mid);
                setDragOverBlockId(null);
              }}
            >
              <div className="story-news-badge" style={{ backgroundColor: b.color }}>
                {b.label}
              </div>

              {blockTags.length === 0 ? (
                <div className="story-news-drop-hint">
                  Drag a moment card here
                </div>
              ) : (
                <>
                  {blockTags.map(tag => {
                    const moment = moments.find(m => m.id === tag.momentId);
                    if (!moment) return null;
                    const photo = moment.photos?.[0];

                    return (
                      <div key={`${b.id}-${tag.momentId}`} className="story-news-entry">
                        <div className="story-news-entry-header">
                          <div className="story-news-entry-meta">
                            <span
                              className="story-news-phase-dot"
                              style={{ backgroundColor: phaseColor(moment.phase) }}
                            />
                            <span className="story-news-phase-label">{phaseLabel(moment.phase)}</span>
                          </div>
                          <div className="story-news-entry-title-row">
                            <span className="story-news-moment-title">{moment.title || '(untitled)'}</span>
                            {photo && <img src={photo} alt="" className="story-news-photo-sm" />}
                            <button
                              className="story-news-remove"
                              onClick={() => onRemoveTag(b.id, tag.momentId)}
                              title="Remove"
                            >×</button>
                          </div>
                          {moment.sub && (
                            <div className="story-news-impact">
                              <span className="story-news-impact-label">Impact</span>
                              {moment.sub}
                            </div>
                          )}
                        </div>

                        <textarea
                          key={`reason-${b.id}-${tag.momentId}`}
                          className="story-news-reason-input"
                          defaultValue={tag.reason}
                          placeholder="Why does this moment represent this story block?"
                          onBlur={(e) => onSaveReason(b.id, tag.momentId, e.target.value.trim())}
                        />
                      </div>
                    );
                  })}

                  <div className="story-news-drop-hint story-news-drop-hint--more">
                    + drag another moment
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
