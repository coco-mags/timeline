import React, { useRef } from 'react';
import { phaseColor } from '../data/phases.js';

export default function ArtifactStrip({ moments, onAddPhoto }) {
  const fileRef = useRef(null);
  const addTargetRef = useRef(null);

  // Collect all photos from all moments with metadata
  const artifacts = [];
  for (const m of moments) {
    (m.photos || []).forEach((src, i) => {
      artifacts.push({ src, momentTitle: m.title, phase: m.phase, momId: m.id, idx: i });
    });
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onAddPhoto && onAddPhoto(ev.target.result, addTargetRef.current);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="artifact-strip">
      {artifacts.length === 0 && (
        <span style={{ fontSize: '10px', color: 'var(--faint)', fontStyle: 'italic' }}>
          Attach photos to moments to see them here
        </span>
      )}
      {artifacts.map((a, i) => (
        <div key={i} className="artifact-thumb">
          <img src={a.src} alt={a.momentTitle} />
          <span
            className="artifact-thumb-label"
            style={{ color: phaseColor(a.phase) }}
          >
            {a.phase}
          </span>
        </div>
      ))}
      <button
        className="artifact-add-btn"
        onClick={() => fileRef.current?.click()}
        title="Add artifact"
      >
        +
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}
