import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PullFromMoments from './PullFromMoments.jsx';

// ── Helpers ────────────────────────────────────────────────────────────────────

// Strip tags to measure whether field has real content
function textContent(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// Safely escape plain text before inserting as HTML
function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// ── Label dot ─────────────────────────────────────────────────────────────────

function FieldLabelDot({ filled }) {
  return <span className={'fu-label-dot' + (filled ? ' filled' : '')} />;
}

// ── Formatting toolbar ────────────────────────────────────────────────────────

const TOOLBAR_ITEMS = [
  { cmd: 'bold',               label: 'B',  title: 'Bold (⌘B)',        style: { fontWeight: 700 } },
  { cmd: 'italic',             label: 'I',  title: 'Italic (⌘I)',      style: { fontStyle: 'italic' } },
  { cmd: 'underline',          label: 'U',  title: 'Underline (⌘U)',   style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough',      label: 'S',  title: 'Strikethrough',    style: { textDecoration: 'line-through' } },
  { type: 'sep' },
  { cmd: 'insertUnorderedList', label: '≡',  title: 'Bullet list' },
  { cmd: 'insertOrderedList',   label: '1.', title: 'Numbered list' },
  { type: 'sep' },
  { cmd: 'formatBlock', value: 'H3', label: 'H',  title: 'Heading' },
  { cmd: 'formatBlock', value: 'P',  label: '¶',  title: 'Paragraph' },
  { type: 'sep' },
  { cmd: 'removeFormat',        label: '✕',  title: 'Clear formatting' },
];

// Commands that support queryCommandState active detection
const STATE_CMDS = new Set([
  'bold', 'italic', 'underline', 'strikeThrough',
  'insertUnorderedList', 'insertOrderedList',
]);

function RichToolbar({ onFormat, activeFormats }) {
  return (
    <div className="fu-toolbar">
      {TOOLBAR_ITEMS.map((item, i) => {
        if (item.type === 'sep') {
          return <span key={i} className="fu-toolbar-sep" />;
        }
        const isActive = STATE_CMDS.has(item.cmd) && activeFormats[item.cmd];
        return (
          <button
            key={i}
            className={'fu-toolbar-btn' + (isActive ? ' active' : '')}
            title={item.title}
            style={item.style}
            onMouseDown={e => { e.preventDefault(); onFormat(item.cmd, item.value); }}
            tabIndex={-1}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ── MoveProgressBar (kept as named export for any remaining imports) ──────────

export function MoveProgressBar({ filled, total }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  return (
    <div className="move-progress-bar">
      <div className="move-progress-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── FieldUnit ─────────────────────────────────────────────────────────────────

export default function FieldUnit({
  label,
  value,
  onChange,
  placeholder,
  hint,
  examples = [],
  type = 'textarea',    // 'textarea' | 'input' — controls single vs multi-line behaviour
  rows = 3,             // used for min-height only
  required = false,
  showPull = false,
  moments,
  phaseFilter,
  onInsert,             // legacy prop, handled internally for HTML-aware insert
}) {
  const [focused, setFocused]           = useState(false);
  const [activeFormats, setActiveFormats] = useState({});
  const editRef   = useRef(null);
  const isFocused = useRef(false);

  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold:                document.queryCommandState('bold'),
      italic:              document.queryCommandState('italic'),
      underline:           document.queryCommandState('underline'),
      strikeThrough:       document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList:   document.queryCommandState('insertOrderedList'),
    });
  }, []);

  const hasContent  = textContent(value).length > 0;
  const hasExamples = examples.length > 0;

  // ── Sync prop → DOM (only when not actively editing) ──────────────────────

  useEffect(() => {
    const el = editRef.current;
    if (!el || isFocused.current) return;
    const incoming = value || '';
    if (el.innerHTML !== incoming) el.innerHTML = incoming;
  }, [value]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleInput = useCallback(() => {
    const el = editRef.current;
    if (el) onChange(el.innerHTML);
  }, [onChange]);

  const handleFormat = useCallback((cmd, value) => {
    editRef.current?.focus();
    document.execCommand(cmd, false, value || null);
    updateActiveFormats();
    const el = editRef.current;
    if (el) onChange(el.innerHTML);
  }, [onChange, updateActiveFormats]);

  const handleKeyDown = useCallback((e) => {
    // Prevent newlines in single-line fields
    if (type === 'input' && e.key === 'Enter') {
      e.preventDefault();
      return;
    }
    // Keyboard shortcuts
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'b') { e.preventDefault(); handleFormat('bold'); }
      if (e.key === 'i') { e.preventDefault(); handleFormat('italic'); }
      if (e.key === 'u') { e.preventDefault(); handleFormat('underline'); }
    }
  }, [type, handleFormat]);

  const handleFocus = useCallback(() => {
    isFocused.current = true;
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    isFocused.current = false;
    setFocused(false);
  }, []);

  // ── Pull-from-moments insert (HTML-aware) ──────────────────────────────────

  const handlePullInsert = useCallback((text) => {
    const el = editRef.current;
    if (!el) return;
    const current = el.innerHTML.replace(/<br\s*\/?>\s*$/, '').trim();
    const newHtml = current
      ? current + '<br><br>' + escapeHtml(text)
      : escapeHtml(text);
    el.innerHTML = newHtml;
    // Move cursor to end
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      if (sel) { sel.removeAllRanges(); sel.addRange(range); }
    } catch (_) { /* ignore */ }
    onChange(newHtml);
  }, [onChange]);

  // ── Render ────────────────────────────────────────────────────────────────

  const minHeight = type === 'textarea' ? `${rows * 22 + 18}px` : undefined;

  return (
    <div className="fu-wrap">
      <div className="fu-label-row">
        <FieldLabelDot filled={hasContent} />
        <span className="fu-label">{label}</span>
      </div>

      <div className={
        'fu-field-wrap' +
        (focused     ? ' focused'     : '') +
        (hasContent  ? ' has-content' : '') +
        (hasExamples ? ' has-examples': '')
      }>
        {/* Formatting toolbar — visible on focus */}
        {focused && <RichToolbar onFormat={handleFormat} activeFormats={activeFormats} />}

        {/* Contenteditable field */}
        <div className="fu-ce-wrap" style={{ minHeight }}>
          {!hasContent && (
            <div className="fu-placeholder" aria-hidden="true">{placeholder}</div>
          )}
          <div
            ref={editRef}
            className={'fu-input fu-rich' + (type === 'input' ? ' fu-rich--single' : '')}
            contentEditable
            suppressContentEditableWarning
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onSelect={updateActiveFormats}
          />
        </div>

        {/* Examples panel — slides in on focus */}
        {hasExamples && (
          <div className="fu-examples">
            <div className="fu-examples-inner">
              <div className="fu-examples-label">how others answered this</div>
              {examples.map((ex, i) => (
                <div key={i} className="fu-example-row">
                  <span className="fu-example-dot" style={{ backgroundColor: ex.color }} />
                  <span className="fu-example-text">"{ex.text}"</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hint — on focus when empty */}
      {hint && focused && !hasContent && (
        <p className="fu-hint">{hint}</p>
      )}

      {/* Pull from moments */}
      {showPull && moments && (
        <PullFromMoments
          moments={moments}
          phaseFilter={phaseFilter}
          onInsert={handlePullInsert}
        />
      )}
    </div>
  );
}
