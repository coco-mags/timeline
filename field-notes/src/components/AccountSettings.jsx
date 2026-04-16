import React, { useState, useEffect } from 'react';
import { ACCENTS } from '../data/accents.js';
import { clearStorage } from '../hooks/useStorage.js';

const TABS = [
  { id: 'profile',    label: 'Profile',       icon: '◎' },
  { id: 'appearance', label: 'Appearance',    icon: '◑' },
  { id: 'voice',      label: 'Voice',         icon: '◐' },
  { id: 'data',       label: 'Data & Export', icon: '◻' },
];

export default function AccountSettings({ open, onClose, currentAccent, onSetAccent, appState, onSaveProfile, onSaveVoice }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [name,     setName]     = useState('');
  const [role,     setRole]     = useState('');
  const [tagline,  setTagline]  = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (appState) {
      const p = appState.profile || {};
      setName(p.name || '');
      setRole(p.role || '');
      setTagline(p.tagline || '');
      const v = appState.voiceProfile || {};
      setQ1(v.q1 || '');
      setQ2(v.q2 || '');
      setQ3(v.q3 || '');
    }
  }, [appState, open]);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleExport = () => {
    const data = JSON.stringify(appState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `fieldnotes-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Reset all data to defaults? This cannot be undone.')) {
      clearStorage();
      localStorage.removeItem('fieldnotes_accent');
      window.location.reload();
    }
  };

  const stats = (() => {
    const projects = appState?.projects || [];
    const moments  = projects.flatMap(p => p.moments);
    const photos   = moments.flatMap(m => m.photos || []);
    return { projects: projects.length, moments: moments.length, photos: photos.length };
  })();

  return (
    <>
      {open && <div className="settings-backdrop" onClick={onClose} />}
      <div className={'settings-panel' + (open ? ' open' : '')}>

        {/* Left nav */}
        <aside className="settings-nav">
          <div className="settings-nav-top">
            <div className="settings-nav-title">Settings</div>
          </div>
          <nav className="settings-nav-list">
            {TABS.map(t => (
              <button
                key={t.id}
                className={'settings-nav-item' + (activeTab === t.id ? ' active' : '')}
                onClick={() => setActiveTab(t.id)}
              >
                <span className="settings-nav-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>
          <button className="settings-nav-close" onClick={onClose}>✕ Close</button>
        </aside>

        {/* Right content */}
        <main className="settings-content">

          {/* ── Profile ── */}
          {activeTab === 'profile' && (
            <div className="settings-pane">
              <div className="settings-pane-heading">Profile</div>
              <p className="settings-pane-sub">This appears in your showcases and exports.</p>

              <div className="settings-field">
                <label className="settings-label">Name</label>
                <input className="settings-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="settings-field">
                <label className="settings-label">Role</label>
                <input className="settings-input" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. UX Designer, Researcher, Strategist" />
              </div>
              <div className="settings-field">
                <label className="settings-label">Tagline</label>
                <input className="settings-input" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="One sentence about your practice" />
              </div>

              <div className="settings-actions">
                <button className="settings-btn-primary" onClick={() => { onSaveProfile({ name, role, tagline }); flashSaved(); }}>
                  {saved ? '✓ Saved' : 'Save profile'}
                </button>
              </div>

              <div className="settings-stat-row">
                <div className="settings-stat"><span>{stats.projects}</span>Projects</div>
                <div className="settings-stat"><span>{stats.moments}</span>Moments</div>
                <div className="settings-stat"><span>{stats.photos}</span>Photos</div>
              </div>
            </div>
          )}

          {/* ── Appearance ── */}
          {activeTab === 'appearance' && (
            <div className="settings-pane">
              <div className="settings-pane-heading">Appearance</div>
              <p className="settings-pane-sub">Choose an accent color for the interface.</p>

              <div className="settings-accent-grid">
                {ACCENTS.map(a => (
                  <button
                    key={a.id}
                    className={'settings-accent-btn' + (currentAccent === a.id ? ' active' : '')}
                    onClick={() => onSetAccent(a.id)}
                  >
                    <span className="settings-accent-swatch" style={{ backgroundColor: a.hex }} />
                    <span className="settings-accent-name">{a.name}</span>
                    {currentAccent === a.id && <span className="settings-accent-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Voice ── */}
          {activeTab === 'voice' && (
            <div className="settings-pane">
              <div className="settings-pane-heading">Your Voice</div>
              <p className="settings-pane-sub">These private answers help the platform write in your voice, not ours.</p>

              <div className="settings-field">
                <label className="settings-label">What do you notice first when you walk into a new space?</label>
                <textarea className="settings-textarea" value={q1} onChange={e => setQ1(e.target.value)} rows={2} />
              </div>
              <div className="settings-field">
                <label className="settings-label">What frustrates you most about how things usually work?</label>
                <textarea className="settings-textarea" value={q2} onChange={e => setQ2(e.target.value)} rows={2} />
              </div>
              <div className="settings-field">
                <label className="settings-label">What does a good day at work feel like?</label>
                <textarea className="settings-textarea" value={q3} onChange={e => setQ3(e.target.value)} rows={2} />
              </div>

              <div className="settings-actions">
                <button className="settings-btn-primary" onClick={() => { onSaveVoice({ q1, q2, q3 }); flashSaved(); }}>
                  {saved ? '✓ Saved' : 'Save voice'}
                </button>
              </div>
            </div>
          )}

          {/* ── Data ── */}
          {activeTab === 'data' && (
            <div className="settings-pane">
              <div className="settings-pane-heading">Data & Export</div>
              <p className="settings-pane-sub">Your data lives only on this device. Nothing is sent to any server.</p>

              <div className="settings-data-card" onClick={handleExport}>
                <div className="settings-data-card-icon">⬇</div>
                <div>
                  <div className="settings-data-card-title">Export all data</div>
                  <div className="settings-data-card-sub">Download a JSON backup of all your projects and moments.</div>
                </div>
              </div>

              <div className="settings-data-card danger" onClick={handleReset}>
                <div className="settings-data-card-icon">↺</div>
                <div>
                  <div className="settings-data-card-title">Reset to defaults</div>
                  <div className="settings-data-card-sub">Wipe all data and start fresh. This cannot be undone.</div>
                </div>
              </div>

              <div className="settings-privacy-note">
                <span className="settings-privacy-icon">⬡</span>
                Field notes stores everything locally using your browser's localStorage. No account, no sync, no tracking.
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}
