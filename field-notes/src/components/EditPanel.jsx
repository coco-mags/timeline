import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PHASES, phaseColor } from '../data/phases.js';

const TOOLBAR = [
  { cmd: 'bold',          icon: 'B',   title: 'Bold',          style: { fontWeight: 700 } },
  { cmd: 'italic',        icon: 'I',   title: 'Italic',        style: { fontStyle: 'italic' } },
  { cmd: 'underline',     icon: 'U',   title: 'Underline',     style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', icon: 'S',   title: 'Strikethrough', style: { textDecoration: 'line-through' } },
  { type: 'sep' },
  { cmd: 'insertUnorderedList', icon: '≡', title: 'Bullet list' },
  { cmd: 'insertOrderedList',   icon: '1.', title: 'Numbered list' },
  { type: 'sep' },
  { cmd: 'formatBlock', value: 'H3',   icon: 'H',   title: 'Heading' },
  { cmd: 'formatBlock', value: 'P',    icon: '¶',   title: 'Paragraph' },
  { type: 'sep' },
  { cmd: 'removeFormat', icon: '✕',   title: 'Clear formatting' },
];

export default function EditPanel({ moment, onSave, onDelete, onCancel, onLiveUpdate }) {
  const [title,          setTitle]          = useState('');
  const [sub,            setSub]            = useState('');
  const [phase,          setPhase]          = useState('observe');
  const [photos,         setPhotos]         = useState([]);
  const [steps,          setSteps]          = useState([]);
  const [whyItMatters,   setWhyItMatters]   = useState('');
  const [photoDragIdx,   setPhotoDragIdx]   = useState(null);
  const [activeFormats,  setActiveFormats]  = useState({});

  const editorRef = useRef(null);
  const fileRef   = useRef(null);
  const momentId  = moment?.id;

  // Load content when moment changes
  useEffect(() => {
    if (moment) {
      setTitle(moment.title || '');
      setSub(moment.sub || '');
      setPhase(moment.phase || 'observe');
      setPhotos(moment.photos || []);
      setSteps(moment.steps || []);
      setWhyItMatters(moment.whyItMatters || '');
      // Set editor HTML — only on moment switch to avoid caret jumping
      if (editorRef.current) {
        editorRef.current.innerHTML = moment.detail || '';
      }
    }
  }, [momentId]); // eslint-disable-line

  const handleTitle = v => { setTitle(v); onLiveUpdate?.({ title: v }); };
  const handleSub   = v => { setSub(v);   onLiveUpdate?.({ sub: v }); };

  const getDetail = () => editorRef.current?.innerHTML || '';

  const handleSave = () => {
    onSave({ ...moment, title, sub, detail: getDetail(), phase, photos, steps, whyItMatters });
  };

  const execFormat = (cmd, value) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value || null);
    updateActiveFormats();
  };

  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold:          document.queryCommandState('bold'),
      italic:        document.queryCommandState('italic'),
      underline:     document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList:   document.queryCommandState('insertOrderedList'),
    });
  }, []);

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
      {/* Phase picker */}
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

        {/* Rich text editor */}
        <div className="edit-rich-section">
          {/* Toolbar */}
          <div className="edit-rich-toolbar">
            {TOOLBAR.map((btn, i) => {
              if (btn.type === 'sep') return <span key={i} className="edit-toolbar-sep" />;
              const isActive = activeFormats[btn.cmd];
              return (
                <button
                  key={i}
                  className={'edit-toolbar-btn' + (isActive ? ' active' : '')}
                  title={btn.title}
                  style={btn.style}
                  onMouseDown={e => {
                    e.preventDefault(); // prevent blur
                    execFormat(btn.cmd, btn.value);
                  }}
                >
                  {btn.icon}
                </button>
              );
            })}
          </div>

          {/* Editable area */}
          <div
            ref={editorRef}
            className="edit-rich-body"
            contentEditable
            suppressContentEditableWarning
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onSelect={updateActiveFormats}
            data-placeholder="Describe what happened. What did you decide? What did you decide NOT to do? What surprised you?"
          />
        </div>

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

        {/* Why it matters */}
        <div className="edit-why-section">
          <div className="edit-section-label">Why it matters</div>
          <textarea
            className="edit-why-input"
            value={whyItMatters}
            onChange={e => setWhyItMatters(e.target.value)}
            placeholder="What's the impact? Why does this moment matter to the project or the people involved?"
          />
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
