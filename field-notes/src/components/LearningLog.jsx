import React from 'react';

export default function LearningLog({ projects, onEditLearning }) {
  const projectsWithLearning = projects.filter(p => p.learning && p.learning.trim());
  const showPov = projectsWithLearning.length >= 2;

  return (
    <>
      {projectsWithLearning.map(p => (
        <div
          key={p.id}
          className="learning-item"
          style={{ borderLeftColor: p.color }}
          onClick={() => onEditLearning(p.id)}
          title="Click to edit"
        >
          "{p.learning}"
        </div>
      ))}
      {projectsWithLearning.length === 0 && (
        <div style={{ padding: '6px 14px', fontSize: '10px', color: 'var(--faint)', fontStyle: 'italic' }}>
          No learnings yet. Close a project to add one.
        </div>
      )}
      {showPov && (
        <div className="pov-block">
          <p>
            There is a pattern here — you notice friction before others name it,
            and you test cheaply before committing. That is your practice.
          </p>
        </div>
      )}
    </>
  );
}
