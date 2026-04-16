import React, { useState, useEffect, useRef } from 'react';
import { PHASES, phaseColor } from '../data/phases.js';

export default function EditPanel({ moment, onSave, onDelete, onCancel, onLiveUpdate }) {
  const [title,        setTitle]        = useState('');
  const [sub,          setSub]          = useState('');
  const [detail,       setDetail]       = useState('');
  const [phase,        setPhase]        = useState('observe');
  const [photos,       setPhotos]       = useState([]);
  const [steps,        setSteps]        = useState([]);
  const [photoDragIdx, setPhotoDragIdx] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (moment) {
      setTitle(moment.title || '');
      setSub(moment.sub || '');
      setDetail(moment.detail || '');
      setPhase(moment.phase || 'observe');
      setPhotos(moment.photos || []);
      setSteps(moment.steps || []);
    }
  }, [moment]);

  const handleTitle = v => { setTitle(v); onLiveUpdate?.({ title: v }); };
  const handleSub   = v => { setSub(v);   onLiveUpdate?.({ sub: v }); };

  const handleSave = () => onSave({ ...moment, title, sub, detail, phase, photos, steps });

  const handlePhotoAdd = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotos(prev => [...prev, ev.target.result]);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const activePhase = PHASES.find(p => p.id === phase);
  const doneCount   = steps.filter(s => s.done).length;

  if (!moment) return null;

  return (
    <div className="edit-panel">
      {/* Phase picker — dot row */}
      <div className="edit-phase-strip">
        {PHASES.map(p => (
          <button
            key={p.id}
            className={'edit-phase-dot-btn' + (phase === p.id ? ' active' : '')}
            style={{ backgroundColor: p.color, color: p.color }}
            title={p.label}
            onClick={() => setPhase(p.id)}
          />
        ))}
        <span className="edit-phase-active-label" style={{ color: phaseColor(phase) }}>
          {activePhase?.label}
        </span>
      </div>

      <div className="edit-panel-inner">
        {/* Title */}
        <input
          className="edit-title-input"
          value={title}
          onChange={e => handleTitle(e.target.value)}
          placeholder="What happened? Name this moment…"
          autoFocus
        />

        {/* Subtitle */}
        <input
          className="edit-sub-input"
          value={sub}
          onChange={e => handleSub(e.target.value)}
          placeholder="One-line summary or impact"
        />

        {/* Detail */}
        <textarea
          className="edit-detail-input"
          value={detail}
          onChange={e => setDetail(e.target.value)}
          placeholder="Describe what happened. What did you decide? What did you decide NOT to do? What surprised you?"
        />

        {/* Photos */}
        <div className="edit-photos-section">
          <div className="edit-section-label">Photos</div>
          <div className="edit-photos-row">
            {photos.map((src, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setPhotoDragIdx(i)}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  if (photoDragIdx === null || photoDragIdx === i) return;
                  const next = [...photos];
                  const [moved] = next.splice(photoDragIdx, 1);
                  next.splice(i, 0, moved);
                  setPhotos(next);
                  setPhotoDragIdx(null);
                }}
                onDragEnd={() => setPhotoDragIdx(null)}
                className={'edit-photo-thumb-wrap' + (photoDragIdx === i ? ' dragging' : '')}
              >
                <img
                  src={src}
                  className="edit-photo-thumb"
                  alt=""
                  onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                  title="Click to remove · drag to reorder"
                />
              </div>
            ))}
            <button className="edit-photo-add" onClick={() => fileRef.current?.click()} title="Add photo">
              <span>+</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoAdd} />
          </div>
          {photos.length > 0 && (
            <div className="edit-photos-hint">Click to remove · drag to reorder</div>
          )}
        </div>

        {/* Design process steps */}
        <div className="edit-steps-section">
          <div className="edit-steps-header">
            <span className="edit-section-label">
              Design process
              {steps.length > 0 && (
                <span className="edit-steps-progress">
                  {doneCount}/{steps.length}
                </span>
              )}
            </span>
            <button
              className="edit-steps-add-btn"
              onClick={() => setSteps(prev => [...prev, { id: Date.now(), text: '', done: false }])}
            >
              + add step
            </button>
          </div>

          {steps.length === 0 && (
            <div className="edit-steps-empty">
              Document the design steps for this moment — what you tried, what you skipped, what you learned.
            </div>
          )}

          {steps.map((step, i) => (
            <div key={step.id} className={'edit-step-row' + (step.done ? ' done' : '')}>
              <button
                className={'edit-step-checkbox' + (step.done ? ' checked' : '')}
                style={step.done ? { borderColor: phaseColor(phase), backgroundColor: phaseColor(phase) } : {}}
                onClick={() => setSteps(prev => prev.map((s, j) => j === i ? { ...s, done: !s.done } : s))}
              >
                {step.done && '✓'}
              </button>
              <input
                className="edit-step-text"
                value={step.text}
                onChange={e => setSteps(prev => prev.map((s, j) => j === i ? { ...s, text: e.target.value } : s))}
                placeholder={`Step ${i + 1}…`}
              />
              <button
                className="edit-step-remove"
                onClick={() => setSteps(prev => prev.filter((_, j) => j !== i))}
              >×</button>
            </div>
          ))}

          {steps.length > 0 && (
            <div className="edit-steps-bar">
              <div
                className="edit-steps-bar-fill"
                style={{ width: `${(doneCount / steps.length) * 100}%`, backgroundColor: phaseColor(phase) }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="edit-actions">
          <button className="edit-save" onClick={handleSave}>Save moment</button>
          <button className="edit-cancel" onClick={onCancel}>Cancel</button>
          <button className="edit-delete" onClick={() => onDelete(moment.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
