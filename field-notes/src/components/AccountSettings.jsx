import React, { useState, useEffect } from 'react';
import { ACCENTS } from '../data/accents.js';
import { clearStorage } from '../hooks/useStorage.js';

export default function AccountSettings({ open, onClose, currentAccent, onSetAccent, appState, onSaveProfile, onSaveVoice }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [tagline, setTagline] = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

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

  const handleExport = () => {
    const data = JSON.stringify(appState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `fieldnotes-export-${date}.json`;
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

  return (
    <>
      {open && (
        <div className="settings-backdrop" onClick={onClose} />
      )}
      <div className={'settings-drawer' + (open ? ' open' : '')}>
        <div className="settings-drawer-header">
          <div className="settings-drawer-title">Settings</div>
          <button className="settings-drawer-close" onClick={onClose}>✕</button>
        </div>

        {/* Section 1 — Profile */}
        <div className="settings-section">
          <div className="settings-section-label">Profile</div>
          <input
            className="settings-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
          />
          <input
            className="settings-input"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. UX Designer, Barista, Shop Manager"
          />
          <input
            className="settings-input"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            placeholder="One sentence about your practice"
          />
          <button
            className="settings-save-btn"
            onClick={() => onSaveProfile({ name, role, tagline })}
          >
            Save profile
          </button>
        </div>

        {/* Section 2 — Accent */}
        <div className="settings-section">
          <div className="settings-section-label">Accent color</div>
          <div className="settings-subtext">Changes the primary color across the whole app.</div>
          <div className="accent-swatches-row">
            {ACCENTS.map(a => (
              <div key={a.id} className="accent-swatch-item" onClick={() => onSetAccent(a.id)}>
                <div
                  className={'accent-swatch-circle' + (currentAccent === a.id ? ' selected' : '')}
                  style={{ backgroundColor: a.hex }}
                />
                <span className="accent-swatch-name">{a.name}</span>
              </div>
            ))}
          </div>
          <div className="accent-selected-name">
            {ACCENTS.find(a => a.id === currentAccent)?.name || 'Ink'}
          </div>
        </div>

        {/* Section 3 — Voice */}
        <div className="settings-section">
          <div className="settings-section-label">Your voice</div>
          <div className="settings-subtext">Helps the platform write in your voice, not ours.</div>
          <input
            className="settings-input"
            value={q1}
            onChange={e => setQ1(e.target.value)}
            placeholder="What do you notice first when you walk into a new space?"
          />
          <input
            className="settings-input"
            value={q2}
            onChange={e => setQ2(e.target.value)}
            placeholder="What frustrates you most about how things usually work?"
          />
          <input
            className="settings-input"
            value={q3}
            onChange={e => setQ3(e.target.value)}
            placeholder="What does a good day at work feel like?"
          />
          <button
            className="settings-save-btn"
            onClick={() => onSaveVoice({ q1, q2, q3 })}
          >
            Save voice
          </button>
        </div>

        {/* Section 4 — Data */}
        <div className="settings-section">
          <div className="settings-section-label">Data</div>
          <button className="settings-data-btn" onClick={handleExport}>
            Export all data
          </button>
          <button className="settings-data-btn danger" onClick={handleReset}>
            Reset to defaults
          </button>
          <div className="settings-data-note">
            Your data lives only on this device. Nothing is sent to any server.
          </div>
        </div>
      </div>
    </>
  );
}
