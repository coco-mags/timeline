import React, { useState, useCallback, useRef } from 'react';
import { useStorage } from './hooks/useStorage.js';
import { useAccent } from './hooks/useAccent.js';
import { makeDefaultProjects } from './data/defaults.js';
import { X_START, X_END } from './hooks/useDrag.js';

import TopNav from './components/TopNav.jsx';
import Sidebar from './components/Sidebar.jsx';
import RiverCanvas from './components/RiverCanvas.jsx';
import EditPanel from './components/EditPanel.jsx';
import MomentCards from './components/MomentCards.jsx';
import ArtifactStrip from './components/ArtifactStrip.jsx';
import StoryValidator from './components/StoryValidator.jsx';
import ContribView from './components/ContribView.jsx';
import ShowcaseSelf from './components/ShowcaseSelf.jsx';
import ShowcasePublic from './components/ShowcasePublic.jsx';
import AccountSettings from './components/AccountSettings.jsx';
import NewProjectModal from './components/NewProjectModal.jsx';
import VoiceCalibration from './components/VoiceCalibration.jsx';
import Toast from './components/Toast.jsx';

const STORY_BLOCKS = [
  { id: 'changed',     label: 'What changed',      color: '#8aab7e', weight: 30 },
  { id: 'matters',     label: 'Why it matters',     color: '#7b9cc4', weight: 20 },
  { id: 'human',       label: 'Human problem',      color: '#b88fc2', weight: 20 },
  { id: 'constraint',  label: 'Sudden constraint',  color: '#d4856a', weight: 15 },
  { id: 'decision',    label: 'Key decision',       color: '#9c8060', weight: 10 },
  { id: 'quote',       label: 'Real quote',         color: '#9c9890', weight: 5  },
];

function buildInitialState() {
  return {
    projects: makeDefaultProjects(),
    activeProjId: 1,
    activeMomId: null,
    nextProjId: 10,
    nextMomId: 400,
    voiceProfile: null,
    profile: { name: '', role: '', tagline: '' },
    canvasView: 'river',
    showcase: null,
    settingsOpen: false,
    storyBlocksOpen: false,
    placedStoryBlocks: [],
    voiceEdits: {},
    toast: null,
  };
}

export default function App() {
  const [state, setState] = useStorage(buildInitialState());
  const { currentAccent, setAccent } = useAccent();
  const toastTimerRef = useRef(null);

  // Show onboarding if voiceProfile is null AND projects match defaults (no user data yet)
  const showOnboarding = state.voiceProfile === null;

  const activeProject = state.projects.find(p => p.id === state.activeProjId);
  const activeMoment = activeProject?.moments.find(m => m.id === state.activeMomId) || null;

  // ── Toast helper ──────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setState(s => ({ ...s, toast: msg }));
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setState(s => ({ ...s, toast: null }));
    }, 2400);
  }, [setState]);

  // ── Project helpers ───────────────────────────────────────────────
  const selectProject = useCallback((id) => {
    setState(s => ({ ...s, activeProjId: id, activeMomId: null }));
  }, [setState]);

  const createProject = useCallback(({ name, color }) => {
    setState(s => {
      const id = s.nextProjId;
      return {
        ...s,
        projects: [...s.projects, { id, name, color, moments: [], learning: '' }],
        activeProjId: id,
        activeMomId: null,
        nextProjId: s.nextProjId + 1,
      };
    });
    showToast('Project created');
  }, [setState, showToast]);

  // ── Moment helpers ────────────────────────────────────────────────
  const addMomentAt = useCallback((x, y) => {
    setState(s => {
      const proj = s.projects.find(p => p.id === s.activeProjId);
      if (!proj) return s;
      const id = s.nextMomId;
      const newMom = { id, x, y, title: '', sub: '', detail: '', phase: 'observe', photos: [] };
      const updatedProjs = s.projects.map(p =>
        p.id === s.activeProjId
          ? { ...p, moments: [...p.moments, newMom] }
          : p
      );
      return { ...s, projects: updatedProjs, activeMomId: id, nextMomId: s.nextMomId + 1 };
    });
  }, [setState]);

  const addMomentViaButton = useCallback(() => {
    setState(s => {
      const proj = s.projects.find(p => p.id === s.activeProjId);
      if (!proj) return s;
      const id = s.nextMomId;
      const existing = proj.moments;
      const total = existing.length + 1;
      const span = X_END - X_START;

      // Redistribute existing moments evenly (sorted by x to preserve order),
      // then place new moment at the rightmost evenly-spaced position.
      const sorted = [...existing].sort((a, b) => a.x - b.x);
      const redistributed = sorted.map((m, i) => ({
        ...m,
        x: X_START + (span * (i + 1)) / (total + 1),
      }));
      const newMom = {
        id,
        x: X_START + (span * total) / (total + 1),
        y: 100,
        title: '', sub: '', detail: '', phase: 'observe', photos: [],
      };

      const updatedProjs = s.projects.map(p =>
        p.id === s.activeProjId
          ? { ...p, moments: [...redistributed, newMom] }
          : p
      );
      return { ...s, projects: updatedProjs, activeMomId: id, nextMomId: s.nextMomId + 1 };
    });
  }, [setState]);

  const saveMoment = useCallback((updated) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === s.activeProjId
          ? { ...p, moments: p.moments.map(m => m.id === updated.id ? updated : m) }
          : p
      ),
      activeMomId: null,
    }));
    showToast('Moment saved');
  }, [setState, showToast]);

  const deleteMoment = useCallback((id) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === s.activeProjId
          ? { ...p, moments: p.moments.filter(m => m.id !== id) }
          : p
      ),
      activeMomId: null,
    }));
    showToast('Moment deleted');
  }, [setState, showToast]);

  const selectMoment = useCallback((id) => {
    setState(s => ({ ...s, activeMomId: s.activeMomId === id ? null : id }));
  }, [setState]);

  const cancelEdit = useCallback(() => {
    setState(s => {
      // If the active moment has no title, remove it (it was just created)
      const proj = s.projects.find(p => p.id === s.activeProjId);
      const mom = proj?.moments.find(m => m.id === s.activeMomId);
      if (mom && !mom.title) {
        return {
          ...s,
          projects: s.projects.map(p =>
            p.id === s.activeProjId
              ? { ...p, moments: p.moments.filter(m => m.id !== s.activeMomId) }
              : p
          ),
          activeMomId: null,
        };
      }
      return { ...s, activeMomId: null };
    });
  }, [setState]);

  const liveUpdateMoment = useCallback((fields) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === s.activeProjId
          ? {
              ...p,
              moments: p.moments.map(m =>
                m.id === s.activeMomId ? { ...m, ...fields } : m
              ),
            }
          : p
      ),
    }));
  }, [setState]);

  const dragMoveMoment = useCallback((id, x, y) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === s.activeProjId
          ? { ...p, moments: p.moments.map(m => m.id === id ? { ...m, x, y } : m) }
          : p
      ),
    }));
  }, [setState]);

  // ── Learning helpers ──────────────────────────────────────────────
  const [learningModal, setLearningModal] = useState(null); // { projId, text }

  const openAddLearning = useCallback(() => {
    const proj = state.projects.find(p => p.id === state.activeProjId);
    if (proj) setLearningModal({ projId: proj.id, text: proj.learning || '' });
  }, [state.projects, state.activeProjId]);

  const openEditLearning = useCallback((projId) => {
    const proj = state.projects.find(p => p.id === projId);
    if (proj) setLearningModal({ projId, text: proj.learning || '' });
  }, [state.projects]);

  const saveLearning = useCallback(() => {
    if (!learningModal) return;
    setState(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === learningModal.projId ? { ...p, learning: learningModal.text } : p
      ),
    }));
    setLearningModal(null);
    showToast('Learning saved');
  }, [learningModal, setState, showToast]);

  // ── New project modal ─────────────────────────────────────────────
  const [newProjModal, setNewProjModal] = useState(false);

  // ── Settings / profile ────────────────────────────────────────────
  const saveProfile = useCallback((profile) => {
    setState(s => ({ ...s, profile }));
    showToast('Settings saved');
  }, [setState, showToast]);

  const saveVoice = useCallback((voiceProfile) => {
    setState(s => ({ ...s, voiceProfile }));
    showToast('Voice saved');
  }, [setState, showToast]);

  const handleSetAccent = useCallback((id) => {
    setAccent(id);
    showToast('Accent updated');
  }, [setAccent, showToast]);

  // ── Photo strip: add to active project's active moment ─────────────
  const handleStripAddPhoto = useCallback((src) => {
    if (!state.activeMomId) {
      // Add to most recent moment
      const proj = state.projects.find(p => p.id === state.activeProjId);
      if (!proj || !proj.moments.length) return;
      const lastMom = [...proj.moments].sort((a, b) => b.id - a.id)[0];
      setState(s => ({
        ...s,
        projects: s.projects.map(p =>
          p.id === s.activeProjId
            ? { ...p, moments: p.moments.map(m => m.id === lastMom.id ? { ...m, photos: [...(m.photos || []), src] } : m) }
            : p
        ),
      }));
    } else {
      setState(s => ({
        ...s,
        projects: s.projects.map(p =>
          p.id === s.activeProjId
            ? { ...p, moments: p.moments.map(m => m.id === s.activeMomId ? { ...m, photos: [...(m.photos || []), src] } : m) }
            : p
        ),
      }));
    }
  }, [state.activeMomId, state.activeProjId, state.projects, setState]);

  // ── Story blocks ──────────────────────────────────────────────────
  const toggleStoryBlock = useCallback((blockId) => {
    setState(s => {
      const placed = s.placedStoryBlocks || [];
      const has = placed.includes(blockId);
      return { ...s, placedStoryBlocks: has ? placed.filter(b => b !== blockId) : [...placed, blockId] };
    });
  }, [setState]);

  const storyCompleteness = (() => {
    const placed = state.placedStoryBlocks || [];
    const total = STORY_BLOCKS.reduce((sum, b) => sum + b.weight, 0);
    const earned = STORY_BLOCKS.filter(b => placed.includes(b.id)).reduce((sum, b) => sum + b.weight, 0);
    return Math.round((earned / total) * 100);
  })();

  // ── Onboarding ────────────────────────────────────────────────────
  const handleOnboardingComplete = useCallback((voiceProfile) => {
    setState(s => ({
      ...s,
      voiceProfile: voiceProfile,
      projects: s.projects.length ? s.projects : makeDefaultProjects(),
    }));
  }, [setState]);

  // ── Render ────────────────────────────────────────────────────────
  if (showOnboarding) {
    return <VoiceCalibration onComplete={handleOnboardingComplete} />;
  }

  const moments = activeProject?.moments || [];

  return (
    <div className="app">
      <TopNav
        projects={state.projects}
        activeProjId={state.activeProjId}
        onSelectProject={selectProject}
        onNewProject={() => setNewProjModal(true)}
        onShowcaseSelf={() => setState(s => ({ ...s, showcase: 'self' }))}
        onShowcasePublic={() => setState(s => ({ ...s, showcase: 'public' }))}
        onOpenSettings={() => setState(s => ({ ...s, settingsOpen: true }))}
      />

      <div className="app-body">
        <Sidebar
          projects={state.projects}
          activeProjId={state.activeProjId}
          onSelectProject={selectProject}
          onNewProject={() => setNewProjModal(true)}
          onEditLearning={openEditLearning}
          onAddLearning={openAddLearning}
        />

        <main className="canvas-area">
          {/* Canvas bar */}
          <div className="canvas-bar">
            <div className="canvas-bar-toggle">
              <button
                className={state.canvasView === 'river' ? 'active' : ''}
                onClick={() => setState(s => ({ ...s, canvasView: 'river' }))}
              >
                River
              </button>
              <button
                className={state.canvasView === 'contrib' ? 'active' : ''}
                onClick={() => setState(s => ({ ...s, canvasView: 'contrib' }))}
              >
                Contribution
              </button>
            </div>
            <button
              className={'canvas-bar-story-btn' + (state.storyBlocksOpen ? ' active' : '')}
              onClick={() => setState(s => ({ ...s, storyBlocksOpen: !s.storyBlocksOpen }))}
            >
              Story blocks {storyCompleteness > 0 ? `· ${storyCompleteness}%` : ''}
            </button>
            <div className="canvas-bar-spacer" />
            {state.canvasView === 'river' && (
              <span className="canvas-bar-hint">Click to place · Drag to adjust</span>
            )}
          </div>

          {/* Story blocks panel */}
          <div
            className="story-blocks-panel"
            style={{ maxHeight: state.storyBlocksOpen ? '80px' : '0' }}
          >
            <div className="story-progress-bar">
              <div className="story-progress-fill" style={{ width: `${storyCompleteness}%` }} />
            </div>
            <div className="story-blocks-inner">
              {STORY_BLOCKS.map(b => (
                <button
                  key={b.id}
                  className={'story-block-btn' + ((state.placedStoryBlocks || []).includes(b.id) ? ' placed' : '')}
                  style={{ backgroundColor: b.color }}
                  onClick={() => toggleStoryBlock(b.id)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {state.canvasView === 'river' ? (
            <>
              <RiverCanvas
                moments={moments}
                activeMomId={state.activeMomId}
                onCanvasClick={addMomentAt}
                onDotClick={selectMoment}
                onDragMove={dragMoveMoment}
              />

              <StoryValidator moments={moments} />

              <ArtifactStrip
                moments={moments}
                onAddPhoto={handleStripAddPhoto}
              />

              <MomentCards
                moments={moments}
                activeMomId={state.activeMomId}
                onSelect={selectMoment}
                onAdd={addMomentViaButton}
              />

              <EditPanel
                moment={activeMoment}
                onSave={saveMoment}
                onDelete={deleteMoment}
                onCancel={cancelEdit}
                onLiveUpdate={liveUpdateMoment}
              />
            </>
          ) : (
            <ContribView
              moments={moments}
              projectName={activeProject?.name}
            />
          )}
        </main>
      </div>

      {/* Showcases */}
      {state.showcase === 'self' && (
        <ShowcaseSelf
          project={activeProject}
          profile={state.profile}
          onClose={() => setState(s => ({ ...s, showcase: null }))}
        />
      )}
      {state.showcase === 'public' && (
        <ShowcasePublic
          project={activeProject}
          voiceEdits={state.voiceEdits}
          onVoiceEdit={(key, val) => setState(s => ({
            ...s,
            voiceEdits: { ...s.voiceEdits, [key]: val },
          }))}
          onClose={() => setState(s => ({ ...s, showcase: null }))}
        />
      )}

      {/* Account Settings Drawer */}
      <AccountSettings
        open={state.settingsOpen}
        onClose={() => setState(s => ({ ...s, settingsOpen: false }))}
        currentAccent={currentAccent}
        onSetAccent={handleSetAccent}
        appState={state}
        onSaveProfile={saveProfile}
        onSaveVoice={saveVoice}
      />

      {/* New Project Modal */}
      {newProjModal && (
        <NewProjectModal
          onCreate={(data) => { createProject(data); setNewProjModal(false); }}
          onCancel={() => setNewProjModal(false)}
        />
      )}

      {/* Learning Modal */}
      {learningModal && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setLearningModal(null); }}>
          <div className="modal">
            <div className="modal-title">Add learning</div>
            <textarea
              className="modal-textarea"
              value={learningModal.text}
              onChange={e => setLearningModal(l => ({ ...l, text: e.target.value }))}
              placeholder="What did this project teach you? Write in your own voice."
              autoFocus
            />
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setLearningModal(null)}>Cancel</button>
              <button className="modal-create" onClick={saveLearning}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast message={state.toast} />
    </div>
  );
}
