import React, { useState, useEffect, useRef } from 'react';
import { phaseColor, phaseLabel } from '../data/phases.js';

export default function SearchPanel({ projects, onSelectMoment, onSelectProject }) {
  const [query, setQuery]   = useState('');
  const [open,  setOpen]    = useState(false);
  const inputRef            = useRef(null);
  const containerRef        = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const q = query.trim().toLowerCase();

  const results = q.length < 1 ? [] : (() => {
    const items = [];
    for (const proj of projects) {
      // Project name match
      if (proj.name.toLowerCase().includes(q)) {
        items.push({ type: 'project', proj, label: proj.name, sub: `${proj.moments.length} moments` });
      }
      // Moment matches
      for (const m of proj.moments) {
        const haystack = [m.title, m.sub, m.detail, m.phase, proj.name].join(' ').toLowerCase();
        if (haystack.includes(q)) {
          items.push({ type: 'moment', proj, moment: m, label: m.title || '(untitled)', sub: `${proj.name} · ${phaseLabel(m.phase)}`, phase: m.phase });
        }
      }
    }
    return items.slice(0, 12);
  })();

  return (
    <div ref={containerRef} className="search-container">
      <div className={'search-input-wrap' + (open ? ' open' : '')}>
        <span className="search-icon">⌕</span>
        <input
          ref={inputRef}
          className="search-input"
          value={query}
          placeholder="Search moments, phases, projects…"
          onFocus={() => setOpen(true)}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onKeyDown={e => e.key === 'Escape' && (setOpen(false), setQuery(''))}
        />
        {query && <button className="search-clear" onClick={() => { setQuery(''); inputRef.current?.focus(); }}>×</button>}
      </div>

      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((r, i) => (
            <div
              key={i}
              className="search-result-row"
              onMouseDown={(e) => {
                e.preventDefault();
                if (r.type === 'moment') onSelectMoment(r.proj.id, r.moment.id);
                else onSelectProject(r.proj.id);
                setOpen(false);
                setQuery('');
              }}
            >
              {r.type === 'moment' && (
                <span className="search-result-dot" style={{ backgroundColor: phaseColor(r.phase) }} />
              )}
              {r.type === 'project' && (
                <span className="search-result-proj-icon">◈</span>
              )}
              <div className="search-result-text">
                <div className="search-result-label">{r.label}</div>
                <div className="search-result-sub">{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && q.length >= 1 && results.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">No results for "{query}"</div>
        </div>
      )}
    </div>
  );
}
