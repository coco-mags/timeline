import React, { useState } from 'react';
import { phaseColor } from '../data/phases.js';
import { SVG_W } from '../hooks/useDrag.js';

export default function ArtifactStrip({ moments }) {
  const [preview, setPreview] = useState(null); // { momentId, photoIdx }

  const withPhotos = moments.filter(m => (m.photos || []).length > 0);

  const openPreview = (momentId, photoIdx = 0) => setPreview({ momentId, photoIdx });
  const closePreview = () => setPreview(null);

  const previewMoment = preview ? moments.find(m => m.id === preview.momentId) : null;
  const previewPhotos = previewMoment?.photos || [];

  return (
    <>
      <div className="artifact-strip">
        {withPhotos.length === 0 && (
          <span className="artifact-strip-empty">
            Photos attached to moments will appear here, aligned to their dot
          </span>
        )}

        {withPhotos.map(m => {
          const photos  = m.photos || [];
          const leftPct = (m.x / SVG_W) * 100;

          return (
            <div
              key={m.id}
              className="artifact-moment-pin"
              style={{ left: `${leftPct}%` }}
              onClick={() => openPreview(m.id, 0)}
            >
              <div
                className="artifact-pin-line"
                style={{ backgroundColor: phaseColor(m.phase) }}
              />
              <div className="artifact-thumb">
                <img src={photos[0]} alt={m.title || ''} title={m.title || ''} />
                {photos.length > 1 && (
                  <span
                    className="artifact-count-badge"
                    style={{ backgroundColor: phaseColor(m.phase) }}
                  >
                    +{photos.length - 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo preview lightbox */}
      {previewMoment && (
        <div className="photo-preview-backdrop" onClick={closePreview}>
          <div className="photo-preview-panel" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="photo-preview-header">
              <div className="photo-preview-meta">
                <span
                  className="photo-preview-phase"
                  style={{ color: phaseColor(previewMoment.phase) }}
                >
                  {previewMoment.phase}
                </span>
                <span className="photo-preview-title">{previewMoment.title || '(untitled)'}</span>
              </div>
              <div className="photo-preview-count">
                {preview.photoIdx + 1} / {previewPhotos.length}
              </div>
              <button className="photo-preview-close" onClick={closePreview}>✕</button>
            </div>

            {/* Main photo */}
            <div className="photo-preview-main">
              {preview.photoIdx > 0 && (
                <button
                  className="photo-preview-nav photo-preview-nav--prev"
                  onClick={() => setPreview(p => ({ ...p, photoIdx: p.photoIdx - 1 }))}
                >‹</button>
              )}
              <img
                src={previewPhotos[preview.photoIdx]}
                className="photo-preview-img"
                alt=""
              />
              {preview.photoIdx < previewPhotos.length - 1 && (
                <button
                  className="photo-preview-nav photo-preview-nav--next"
                  onClick={() => setPreview(p => ({ ...p, photoIdx: p.photoIdx + 1 }))}
                >›</button>
              )}
            </div>

            {/* Thumbnail strip */}
            {previewPhotos.length > 1 && (
              <div className="photo-preview-thumbs">
                {previewPhotos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className={'photo-preview-thumb' + (i === preview.photoIdx ? ' active' : '')}
                    style={i === preview.photoIdx ? { borderColor: phaseColor(previewMoment.phase) } : {}}
                    onClick={() => setPreview(p => ({ ...p, photoIdx: i }))}
                    alt=""
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
