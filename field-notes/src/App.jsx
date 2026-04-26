import React, { useState, useCallback, useRef, useEffect } from 'react';
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
import StoryBlocksPanel from './components/StoryBlocksPanel.jsx';
import StoryBlockBuilder from './components/StoryBlockBuilder.jsx';
import { emptyStoryBuilder } from './hooks/useStoryBlocks.js';
import StoryFlowBuilder from './components/StoryFlowBuilder.jsx';
import { emptyStoryFlow } from './hooks/useStoryFlow.js';
import { DEFAULT_PORTFOLIO_DESIGN } from './data/portfolioDesign.js';
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
    storyTags: [],
    voiceEdits: {},
    toast: null,
    portfolioDesign: DEFAULT_PORTFOLIO_DESIGN,
  };
}

export default function App() {
  const [state, setState] = useStorage(buildInitialState());
  const { currentAccent, setAccent } = useAccent();
  const toastTimerRef = useRef(null);

  // ── Panel resize ──────────────────────────────────────────────────
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [leftWidth,     setLeftWidth]     = useState(186);
  const [rightWidth,    setRightWidth]    = useState(220);
  const [learningHeight, setLearningHeight] = useState(60);
  const [isResizing,    setIsResizing]    = useState(false);
  const resizeState = useRef(null); // { side, startX/Y, startSize }

  // Track whether the middle area is wide enough (sidebar × 2)
  const [isMiddleWide, setIsMiddleWide] = useState(
    () => window.innerWidth - 186 - 220 >= 186 * 2
  );

  useEffect(() => {
    const check = () => {
      const middle = window.innerWidth - leftWidth - rightWidth;
      const wide   = middle >= leftWidth * 2;
      setIsMiddleWide(wide);
      setSidebarOpen(wide);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [leftWidth, rightWidth]);

  useEffect(() => {
    const onMove = (e) => {
      if (!resizeState.current) return;
      const { side, startX, startY, startSize } = resizeState.current;
      if (side === 'left') {
        setLeftWidth(Math.max(120, Math.min(400, startSize + (e.clientX - startX))));
      } else if (side === 'right') {
        setRightWidth(Math.max(160, Math.min(500, startSize - (e.clientX - startX))));
      } else if (side === 'learning') {
        // dragging up increases height
        setLearningHeight(Math.max(40, Math.min(400, startSize - (e.clientY - startY))));
      }
    };
    const onUp = () => {
      if (resizeState.current) {
        resizeState.current = null;
        setIsResizing(false);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

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
        projects: [...s.projects, { id, name, color, moments: [], learning: '', storyBuilder: emptyStoryBuilder(), storyFlow: emptyStoryFlow() }],
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

  const reorderMoments = useCallback((fromId, toId) => {
    setState(s => {
      const proj = s.projects.find(p => p.id === s.activeProjId);
      if (!proj) return s;
      const fromMom = proj.moments.find(m => m.id === fromId);
      const toMom   = proj.moments.find(m => m.id === toId);
      if (!fromMom || !toMom) return s;
      const updatedMoments = proj.moments.map(m => {
        if (m.id === fromId) return { ...m, x: toMom.x };
        if (m.id === toId)   return { ...m, x: fromMom.x };
        return m;
      });
      return {
        ...s,
        projects: s.projects.map(p =>
          p.id === s.activeProjId ? { ...p, moments: updatedMoments } : p
        ),
      };
    });
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

  const savePortfolioDesign = useCallback((portfolioDesign) => {
    setState(s => ({ ...s, portfolioDesign }));
  }, [setState]);

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

  // ── Story tags ────────────────────────────────────────────────────
  const saveStoryTag = useCallback((blockId, momentId, reason) => {
    setState(s => ({
      ...s,
      storyTags: [
        ...(s.storyTags || []).filter(t => !(t.blockId === blockId && t.momentId === momentId)),
        { blockId, momentId, reason },
      ],
    }));
  }, [setState]);

  const removeStoryTag = useCallback((blockId, momentId) => {
    setState(s => ({
      ...s,
      storyTags: (s.storyTags || []).filter(t => !(t.blockId === blockId && t.momentId === momentId)),
    }));
  }, [setState]);

  const dropMomentToBlock = useCallback((blockId, momentId) => {
    setState(s => {
      const already = (s.storyTags || []).some(t => t.blockId === blockId && t.momentId === momentId);
      if (already) return s;
      return {
        ...s,
        storyTags: [...(s.storyTags || []), { blockId, momentId, reason: '' }],
      };
    });
  }, [setState]);

  // ── Inline learning save ──────────────────────────────────────────
  const saveProjectLearningInline = useCallback((text) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === s.activeProjId ? { ...p, learning: text } : p
      ),
    }));
  }, [setState]);


  const updateStoryFlow = useCallback((sf) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === s.activeProjId ? { ...p, storyFlow: sf } : p
      ),
    }));
  }, [setState]);

  const updateStoryBuilder = useCallback((sb) => {
    setState(s => ({
      ...s,
      projects: s.projects.map(p =>
        p.id === s.activeProjId ? { ...p, storyBuilder: sb } : p
      ),
    }));
  }, [setState]);

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
        onSelectProject={(projId) => {
          setState(s => ({ ...s, activeProjId: projId, activeMomId: null, canvasView: 'river' }));
        }}
        onNewProject={() => setNewProjModal(true)}
        onShowcaseSelf={() => setState(s => ({ ...s, showcase: 'self' }))}
        onShowcasePublic={() => setState(s => ({ ...s, showcase: 'public' }))}
        onOpenSettings={() => setState(s => ({ ...s, settingsOpen: true }))}
        onToggleSidebar={() => setSidebarOpen(s => !s)}
        onSelectMoment={(projId, momId) => {
          setState(s => ({ ...s, activeProjId: projId, activeMomId: momId, canvasView: 'river' }));
        }}
      />

      <div className={'app-body' + (isResizing ? ' resizing' : '')}>
        <Sidebar
          style={sidebarOpen
            ? { width: leftWidth, borderRight: '0.5px solid var(--line)' }
            : { width: 0, overflow: 'hidden', borderRight: 'none' }
          }
          projects={state.projects}
          activeProjId={state.activeProjId}
          onSelectProject={selectProject}
          onNewProject={() => setNewProjModal(true)}
          onOpenSettings={() => setState(s => ({ ...s, settingsOpen: true }))}
        />

        {sidebarOpen && (
          <div
            className="resize-handle"
            onMouseDown={(e) => {
              e.preventDefault();
              resizeState.current = { side: 'left', startX: e.clientX, startSize: leftWidth };
              setIsResizing(true);
            }}
          />
        )}

        <main className="canvas-area">
          {/* Canvas bar */}
          <div className="canvas-bar">
            <div className="canvas-view-tabs">

              {/* River tab */}
              <button
                className={'canvas-tab' + (state.canvasView === 'river' ? ' active' : '')}
                onClick={() => setState(s => ({ ...s, canvasView: 'river' }))}
              >
                <svg className="canvas-tab-icon" viewBox="0 0 16 16" fill="none">
                  <path d="M1 9 C3.5 4 5.5 4 8 8 C10.5 12 12.5 12 15 7"
                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="1" cy="9" r="1.2" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
                  <circle cx="15" cy="7" r="1.2" fill="currentColor"/>
                </svg>
                <span className="canvas-tab-label">River</span>
              </button>

              {/* Insights tab */}
              <button
                className={'canvas-tab' + (state.canvasView === 'contrib' ? ' active' : '')}
                onClick={() => setState(s => ({ ...s, canvasView: 'contrib' }))}
              >
                <svg className="canvas-tab-icon" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1.5" y="9" width="3" height="6" rx="0.75"/>
                  <rect x="6.5" y="5.5" width="3" height="9.5" rx="0.75"/>
                  <rect x="11.5" y="2" width="3" height="13" rx="0.75"/>
                </svg>
                <span className="canvas-tab-label">Insights</span>
              </button>

              {/* Story tab */}
              <button
                className={'canvas-tab' + (state.canvasView === 'story' ? ' active' : '')}
                onClick={() => setState(s => ({ ...s, canvasView: 'story' }))}
              >
                <svg className="canvas-tab-icon" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1.5" width="14" height="4" rx="1"/>
                  <rect x="1" y="7.5" width="10" height="3" rx="1"/>
                  <rect x="1" y="12" width="7" height="2.5" rx="1"/>
                </svg>
                <span className="canvas-tab-label">Story</span>
                {(state.storyTags || []).length > 0 && (
                  <span className="canvas-tab-badge">{(state.storyTags || []).length}</span>
                )}
              </button>

            </div>

            <div className="canvas-bar-spacer" />

            {isMiddleWide && (
              <span className="canvas-bar-hint">
                {state.canvasView === 'river'  && 'Click between dots to insert · Drag to adjust height'}
                {state.canvasView === 'contrib' && 'Phase breakdown and moment stats for this project'}
                {state.canvasView === 'story'   && 'Write your case study · Pull from moments to quote your own work'}
              </span>
            )}
          </div>

          {state.canvasView === 'river' ? (
            <>
              <RiverCanvas
                moments={moments}
                activeMomId={state.activeMomId}
                onCanvasClick={addMomentAt}
                onDotClick={selectMoment}
                onDragMove={dragMoveMoment}
                onAdd={addMomentViaButton}
                storyTags={state.storyTags || []}
                storyBlocks={STORY_BLOCKS}
              />

              <ArtifactStrip moments={moments} />

              {/* Learning log for current project */}
              <div className="project-learning" style={{ height: learningHeight }}>
                <div
                  className="resize-handle-h"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    resizeState.current = { side: 'learning', startY: e.clientY, startSize: learningHeight };
                    setIsResizing(true);
                  }}
                />
                <div className="project-learning-body">
                  <textarea
                    key={activeProject?.id}
                    className="project-learning-input"
                    defaultValue={activeProject?.learning || ''}
                    placeholder="What did this project teach you? Write in your own voice."
                    onBlur={(e) => saveProjectLearningInline(e.target.value.trim())}
                  />
                </div>
              </div>
            </>

          ) : state.canvasView === 'story' ? (
            <StoryFlowBuilder
              key={activeProject?.id}
              project={activeProject}
              moments={moments}
              onUpdate={updateStoryFlow}
              onGenerateShowcase={() => setState(s => ({ ...s, showcase: 'public' }))}
            />
          ) : (
            <ContribView
              moments={moments}
              projectName={activeProject?.name}
            />
          )}
        </main>

        <div
          className="resize-handle"
          onMouseDown={(e) => {
            e.preventDefault();
            resizeState.current = { side: 'right', startX: e.clientX, startSize: rightWidth };
            setIsResizing(true);
          }}
        />

        {/* Right panel — moments list + edit */}
        <div className="moments-panel" style={{ width: rightWidth, borderLeft: '0.5px solid var(--line)' }}>
          <div className="moments-panel-header">
            <span className="moments-panel-label">Moments</span>
          </div>
          <MomentCards
            moments={moments}
            activeMomId={state.activeMomId}
            onSelect={selectMoment}
            onAdd={addMomentViaButton}
            onDelete={deleteMoment}
            onReorder={reorderMoments}
            storyTags={state.storyTags || []}
            storyBlocks={STORY_BLOCKS}
          />
          <EditPanel
            moment={activeMoment}
            onSave={saveMoment}
            onDelete={deleteMoment}
            onCancel={cancelEdit}
            onLiveUpdate={liveUpdateMoment}
          />
        </div>
      </div>


      {/* Showcases */}
      {state.showcase === 'self' && (
        <ShowcaseSelf
          project={activeProject}
          profile={state.profile}
          onClose={() => setState(s => ({ ...s, showcase: null }))}
          storyTags={state.storyTags || []}
          storyBlocks={STORY_BLOCKS}
        />
      )}
      {state.showcase === 'public' && (
        <ShowcasePublic
          project={activeProject}
          onClose={() => setState(s => ({ ...s, showcase: null }))}
          portfolioDesign={state.portfolioDesign}
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
        portfolioDesign={state.portfolioDesign}
        onSavePortfolioDesign={savePortfolioDesign}
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
