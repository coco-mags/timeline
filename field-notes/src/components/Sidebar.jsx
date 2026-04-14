import React from 'react';
import { PHASES } from '../data/phases.js';
import LearningLog from './LearningLog.jsx';

export default function Sidebar({
  projects,
  activeProjId,
  onSelectProject,
  onNewProject,
  onEditLearning,
  onAddLearning,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section-label">Projects</div>
      {projects.map(p => (
        <div
          key={p.id}
          className={'sidebar-project' + (p.id === activeProjId ? ' active' : '')}
          onClick={() => onSelectProject(p.id)}
        >
          <div className="sidebar-proj-dot" style={{ backgroundColor: p.color }} />
          <span className="sidebar-proj-name">{p.name}</span>
          <span className="sidebar-proj-count">{p.moments.length}</span>
        </div>
      ))}
      <button className="sidebar-add-btn" onClick={onNewProject}>+ new project</button>

      <hr className="sidebar-divider" />

      <div className="sidebar-section-label">Phases</div>
      <div className="phase-key">
        {PHASES.map(p => (
          <div key={p.id} className="phase-key-row">
            <div className="phase-key-dot" style={{ backgroundColor: p.color }} />
            <span>{p.label}</span>
          </div>
        ))}
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section-label">Learning log</div>
      <LearningLog projects={projects} onEditLearning={onEditLearning} />
      <button className="sidebar-add-btn" onClick={onAddLearning}>+ add learning</button>
    </aside>
  );
}
