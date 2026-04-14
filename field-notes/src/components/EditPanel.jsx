import React, { useState, useEffect, useRef } from 'react';
import { PHASES, phaseColor } from '../data/phases.js';

export default function EditPanel({ moment, onSave, onDelete, onCancel, onLiveUpdate }) {
  const [title, setTitle] = useState('');
  const [sub, setSub] = useState('');
  const [detail, setDetail] = useState('');
  const [phase, setPhase] = useState('observe');
  const [photos, setPhotos] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => {
    if (moment) {
      setTitle(moment.title || '');
      setSub(moment.sub || '');
      setDetail(moment.detail || '');
      setPhase(moment.phase || 'observe');
      setPhotos(moment.photos || []);
    }
  }, [moment]);

  const handleTitle = (v) => {
    setTitle(v);
    onLiveUpdate && onLiveUpdate({ title: v });
  };

  const handleSub = (v) => {
    setSub(v);
    onLiveUpdate && onLiveUpdate({ sub: v });
  };

  const handleSave = () => {
    onSave({ ...moment, title, sub, detail, phase, photos });
  };

  const handlePhotoAdd = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotos(prev => [...prev, ev.target.result]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePhotoRemove = (idx) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  if (!moment) return null;

  return (
    <div className="edit-panel" style={{ maxHeight: '280px' }}>
      <div className="edit-panel-inner">
        {/* Row 1: title + sub + phase pills */}
        <div className="edit-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <input
            className="edit-input edit-input-title"
            value={title}
            onChange={e => handleTitle(e.target.value)}
            placeholder="Moment title"
          />
          <input
            className="edit-input edit-input-sub"
            value={sub}
            onChange={e => handleSub(e.target.value)}
            placeholder="Short note"
          />
          <div className="phase-pills">
            {PHASES.map(p => (
              <button
                key={p.id}
                className={'phase-pill' + (phase === p.id ? ' selected' : '')}
                style={phase === p.id ? { backgroundColor: p.color } : {}}
                onClick={() => setPhase(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: detail + photos */}
        <div className="edit-row" style={{ alignItems: 'flex-start' }}>
          <textarea
            className="edit-detail"
            value={detail}
            onChange={e => setDetail(e.target.value)}
            placeholder="What happened? Include decisions made and what you decided NOT to do."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="edit-photos-row">
              {photos.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="edit-photo-thumb"
                  alt=""
                  onClick={() => handlePhotoRemove(i)}
                  title="Click to remove"
                />
              ))}
              <button
                className="edit-photo-add"
                onClick={() => fileRef.current?.click()}
                title="Add photo"
              >
                +
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoAdd}
              />
            </div>
            {photos.length > 0 && (
              <span style={{ fontSize: '9px', color: 'var(--muted)' }}>
                {photos.length} photo{photos.length > 1 ? 's' : ''} · click to remove
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="edit-actions">
          <button className="edit-save" onClick={handleSave}>Save</button>
          <button className="edit-delete" onClick={() => onDelete(moment.id)}>Delete</button>
          <button className="edit-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
