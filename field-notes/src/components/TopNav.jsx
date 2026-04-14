import React from 'react';

export default function TopNav({
  projects,
  activeProjId,
  onSelectProject,
  onNewProject,
  onShowcaseSelf,
  onShowcasePublic,
  onOpenSettings,
}) {
  return (
    <nav className="top-nav">
      <div className="nav-logo">field notes</div>

      <div className="nav-tabs">
        {projects.map(p => (
          <div
            key={p.id}
            className={'nav-tab' + (p.id === activeProjId ? ' active' : '')}
            onClick={() => onSelectProject(p.id)}
          >
            <div className="nav-tab-dot" style={{ backgroundColor: p.color }} />
            {p.name}
          </div>
        ))}
        <button className="nav-add-proj" onClick={onNewProject} title="New project">+</button>
      </div>

      <div className="nav-right">
        <button className="btn-ghost" onClick={onShowcaseSelf}>For myself</button>
        <button className="btn-filled" onClick={onShowcasePublic}>Portfolio</button>
        <button className="nav-gear" onClick={onOpenSettings} title="Settings">⚙</button>
      </div>
    </nav>
  );
}
