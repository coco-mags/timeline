import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { buildDesignVars, DEFAULT_PORTFOLIO_DESIGN } from '../data/portfolioDesign.js';

// ── Helpers ────────────────────────────────────────────────────────────────────

// Strip tags to get plain text (for logic checks only)
function plain(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// v() now strips tags to detect presence, but preserves HTML for rendering
function v(s) { return (s && plain(s).length > 0) ? s.trim() : ''; }

// Render a field value as HTML — handles both plain text and stored rich HTML
function Html({ html, className }) {
  if (!html) return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Render bullets — split on <br> or newlines, prefix each with ✦
function renderBullets(html) {
  const lines = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  if (lines.length <= 1) return <Html html={html} className="pf-body" />;
  return (
    <ul className="pf-bullet-list">
      {lines.map((l, i) => (
        <li key={i}><span className="pf-bullet-prefix">✦</span>{l.replace(/^[✦•\-]\s*/, '')}</li>
      ))}
    </ul>
  );
}

// Render role lines — split on <br> or newlines
function renderRoleLines(html) {
  const lines = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  if (lines.length <= 1) return <Html html={html} className="pf-body" />;
  return (
    <div className="pf-role-lines">
      {lines.map((l, i) => (
        <p key={i} className={'pf-body' + (l.startsWith('⇥') ? ' pf-role-indent' : '')}>{l}</p>
      ))}
    </div>
  );
}

// ── Section configs ────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: 'overview',  label: 'Overview'   },
  { id: 'moment',    label: 'The Moment' },
  { id: 'goal',      label: 'The Goal'   },
  { id: 'role',      label: 'My Role'    },
  { id: 'build',     label: 'The Build'  },
  { id: 'evidence',  label: 'Evidence'   },
  { id: 'outcomes',  label: 'Outcomes'   },
  { id: 'learning',  label: 'Learning'   },
];

// ── Main component ─────────────────────────────────────────────────────────────

export default function ShowcasePublic({ project, onClose, portfolioDesign }) {
  const designVars = useMemo(
    () => buildDesignVars(portfolioDesign || DEFAULT_PORTFOLIO_DESIGN),
    [portfolioDesign]
  );
  const sf      = project?.storyFlow || {};
  const moments = project?.moments   || [];

  const [activeId, setActiveId] = useState('overview');
  const sectionRefs  = useRef({});
  const scrollAreaRef = useRef(null);

  // ── Extract content ──────────────────────────────────────────────────────────

  const title       = v(sf.human?.title)              || project?.name || '';
  const contextLine = v(sf.human?.contextLine)         || '';
  const situation   = v(sf.human?.situation)           || '';
  const insight     = v(sf.turningPoint?.insight)      || '';
  const tpRejected  = v(sf.turningPoint?.rejected)     || '';
  const successCrit = v(sf.role?.successCriteria)      || '';
  const contribution = v(sf.role?.contribution)        || '';
  const decisions   = Array.isArray(sf.decisions)
    ? sf.decisions.filter(d => v(d.name))
    : [];
  const keyData     = v(sf.evidence?.keyData)          || '';
  const observation = v(sf.evidence?.observation)      || '';
  const competitive = v(sf.problem?.competitive)       || '';
  const changed     = v(sf.outcome?.changed)           || '';
  const honest      = v(sf.outcome?.honest)            || '';
  const learning    = v(sf.learning?.text)             || v(project?.learning) || '';

  const metaPills = contextLine
    ? contextLine.split('·').map(p => p.trim()).filter(Boolean)
    : [];

  const observePhotos = moments
    .filter(m => ['observe', 'define'].includes(m.phase))
    .flatMap(m => m.photos || []);
  const launchPhotos  = moments
    .filter(m => m.phase === 'launch')
    .flatMap(m => m.photos || []);

  // ── Section visibility ───────────────────────────────────────────────────────

  const has = {
    overview:  !!(title || situation),
    moment:    !!(insight),
    goal:      !!(successCrit),
    role:      !!(contribution),
    build:     decisions.length > 0,
    evidence:  !!(keyData || observation || competitive || observePhotos.length),
    outcomes:  !!(changed),
    learning:  !!(learning),
  };

  const visibleSections = NAV_SECTIONS.filter(s => has[s.id]);

  // ── IntersectionObserver ─────────────────────────────────────────────────────

  useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;
    const observers = [];

    visibleSections.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        entries => { if (entries[0].isIntersecting) setActiveId(id); },
        { root, threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSections.map(s => s.id).join(',')]);

  // ── Scroll to section ────────────────────────────────────────────────────────

  const scrollTo = useCallback((id) => {
    const el  = sectionRefs.current[id];
    const box = scrollAreaRef.current;
    if (!el || !box) return;
    box.scrollTo({ top: el.offsetTop - 32, behavior: 'smooth' });
  }, []);

  const setRef = id => el => { sectionRefs.current[id] = el; };

  if (!project) return null;

  return (
    <div className="showcase-overlay">

      {/* Header */}
      <div className="showcase-header">
        <div className="showcase-logo">field notes</div>
        <button className="showcase-close" onClick={onClose}>✕ Close</button>
      </div>

      {/* Body: nav + scroll area */}
      <div className="pf-wrap">

        {/* Fixed left nav */}
        <nav className="pf-nav" aria-label="Page sections">
          {visibleSections.map(({ id, label }) => (
            <button
              key={id}
              className={'pf-nav-item' + (activeId === id ? ' active' : '')}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Scrollable content */}
        <div className="pf-scroll-area" ref={scrollAreaRef}>
          <div className="pf-content" style={designVars}>

            {/* ── OVERVIEW ── */}
            {has.overview && (
              <section ref={setRef('overview')} className="pf-section">
                <h1 className="pf-title">{title}</h1>

                {metaPills.length > 0 && (
                  <div className="pf-meta-pills">
                    {metaPills.map((p, i) => (
                      <span key={i} className="pf-meta-pill">{p}</span>
                    ))}
                  </div>
                )}

                {situation && <Html html={situation} className="pf-opening" />}

                {changed && (
                  <div className="pf-impact-callout">
                    <div className="pf-impact-label">impact</div>
                    <Html html={changed} className="pf-impact-text" />
                  </div>
                )}
              </section>
            )}

            {/* ── THE MOMENT IT CLICKED ── */}
            {has.moment && (
              <section ref={setRef('moment')} className="pf-section">
                <div className="pf-section-heading">The moment it clicked</div>
                <Html html={insight} className="pf-insight" />
                {tpRejected && (
                  <div className="pf-callout">
                    <Html html={tpRejected} className="pf-callout-body" />
                  </div>
                )}
              </section>
            )}

            {/* ── THE GOAL ── */}
            {has.goal && (
              <section ref={setRef('goal')} className="pf-section">
                <div className="pf-section-heading">The goal</div>
                {renderBullets(successCrit)}
              </section>
            )}

            {/* ── MY ROLE ── */}
            {has.role && (
              <section ref={setRef('role')} className="pf-section">
                <div className="pf-section-heading">My role</div>
                {renderRoleLines(contribution)}
              </section>
            )}

            {/* ── THE BUILD: A STORY IN BETS ── */}
            {has.build && (
              <section ref={setRef('build')} className="pf-section">
                <div className="pf-section-heading">The build: a story in bets</div>
                {decisions.map((d, i) => (
                  <div key={i} className="pf-bet-block">
                    <div className="pf-bet-heading">Bet {i + 1} — {plain(d.name)}</div>
                    {v(d.built) && <Html html={d.built} className="pf-body" />}
                    {v(d.rejected) && (
                      <div className="pf-callout pf-callout--subtle">
                        <span className="pf-callout-label">decided not to:</span>
                        <Html html={d.rejected} className="pf-callout-body pf-callout-body--inline" />
                      </div>
                    )}
                    {v(d.impact) && (
                      <p className="pf-impact-note">
                        <span className="pf-impact-note-label">✨ Why it matters?</span>
                        <Html html={d.impact} className="pf-impact-note-body" />
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* ── THE EVIDENCE ── */}
            {has.evidence && (
              <section ref={setRef('evidence')} className="pf-section">
                <div className="pf-section-heading">The evidence</div>
                {keyData     && <Html html={keyData}     className="pf-stat-line" />}
                {observation && <Html html={observation} className="pf-body" />}
                {competitive && <Html html={competitive} className="pf-body" />}
                {observePhotos.length > 0 && (
                  <div className="pf-photo-grid">
                    {observePhotos.map((src, i) => (
                      <img key={i} src={src} alt="" className="pf-photo" />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── OUTCOMES ── */}
            {has.outcomes && (
              <section ref={setRef('outcomes')} className="pf-section">
                <div className="pf-section-heading">Outcomes</div>
                <Html html={changed} className="pf-body" />
                {honest && (
                  <div className="pf-honest-block">
                    <div className="pf-honest-label">the honest part</div>
                    <Html html={honest} className="pf-honest-text" />
                  </div>
                )}
                {launchPhotos.length > 0 && (
                  <div className="pf-photo-grid pf-photo-grid--single" style={{ marginTop: '16px' }}>
                    {launchPhotos.map((src, i) => (
                      <img key={i} src={src} alt="" className="pf-photo" />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── WHAT I LEARNED ── */}
            {has.learning && (
              <section ref={setRef('learning')} className="pf-section">
                <div className="pf-section-heading">What I learned</div>
                <div className="pf-learning-block">
                  <Html html={`"${plain(learning)}"`} className="pf-learning-text" />
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
