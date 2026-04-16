import React from 'react';
import SearchPanel from './SearchPanel.jsx';

export default function TopNav({
  projects,
  activeProjId,
  onSelectProject,
  onNewProject,
  onShowcaseSelf,
  onShowcasePublic,
  onOpenSettings,
  onToggleSidebar,
  onSelectMoment,
}) {
  return (
    <nav className="top-nav">
      <button className="nav-sidebar-toggle" onClick={onToggleSidebar} title="Toggle sidebar">
        <span className="nav-sidebar-toggle-icon">☰</span>
      </button>
      <SearchPanel
        projects={projects}
        onSelectMoment={onSelectMoment}
        onSelectProject={onSelectProject}
      />

      <div className="nav-right">
        <button className="btn-ghost" onClick={onShowcaseSelf}>For myself</button>
        <button className="btn-filled" onClick={onShowcasePublic}>Portfolio</button>
      </div>
    </nav>
  );
}
