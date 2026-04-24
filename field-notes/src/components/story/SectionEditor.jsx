import React from 'react';

import HookSection         from './sections/HookSection.jsx';
import ProblemSection      from './sections/ProblemSection.jsx';
import TurningPointSection from './sections/TurningPointSection.jsx';
import RoleSection         from './sections/RoleSection.jsx';
import ProcessSection      from './sections/ProcessSection.jsx';
import OutcomeSection      from './sections/OutcomeSection.jsx';
import LearningSection     from './sections/LearningSection.jsx';
import NextSection         from './sections/NextSection.jsx';
import SectionTips         from './SectionTips.jsx';

const SECTION_META = {
  hook:         { title: 'Hook',          subtitle: 'Open with the world before your solution.' },
  problem:      { title: 'Problem',       subtitle: 'Name the problem sharply. Show the evidence.' },
  turningPoint: { title: 'Turning Point', subtitle: 'The insight that changed everything.' },
  role:         { title: 'Role',          subtitle: 'What did you specifically own?' },
  process:      { title: 'Process',       subtitle: 'Walk through the key decisions, not every step.' },
  outcome:      { title: 'Outcome',       subtitle: "What changed? Be honest about what didn't." },
  learning:     { title: 'Learning',      subtitle: "One principle you'd carry forward." },
  next:         { title: 'Next',          subtitle: 'Where would you take this? (Optional)' },
};

const COMPONENTS = {
  hook:         HookSection,
  problem:      ProblemSection,
  turningPoint: TurningPointSection,
  role:         RoleSection,
  process:      ProcessSection,
  outcome:      OutcomeSection,
  learning:     LearningSection,
  next:         NextSection,
};

function normalizeData(sectionId, raw) {
  if (sectionId === 'process' && Array.isArray(raw)) {
    return { cards: raw };
  }
  return raw || {};
}

export default function SectionEditor({ sectionId, storyBuilder, onChange }) {
  const meta      = SECTION_META[sectionId] || {};
  const Component = COMPONENTS[sectionId];
  if (!Component) return null;

  const data = normalizeData(sectionId, storyBuilder[sectionId]);

  return (
    <div className="story-section-editor">
      <div className="story-section-header">
        <h2 className="story-section-title">{meta.title}</h2>
        <p className="story-section-subtitle">{meta.subtitle}</p>
      </div>

      <Component
        data={data}
        onChange={val => onChange(sectionId, val)}
      />

      <SectionTips sectionId={sectionId} />
    </div>
  );
}
