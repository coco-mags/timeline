import React, { useState } from 'react';
import { calcCompleteness } from '../hooks/useStoryBlocks.js';
import SectionNav    from './story/SectionNav.jsx';
import SectionEditor from './story/SectionEditor.jsx';

export default function StoryBlockBuilder({ project, onUpdate }) {
  const [activeSection, setActiveSection] = useState('hook');

  const sb           = project.storyBuilder;
  const completeness = calcCompleteness(sb);

  const handleChange = (sectionId, val) => onUpdate({ ...sb, [sectionId]: val });

  const handleDropMoment = (sectionId, text) => {
    // switch to the section the moment was dropped on
    setActiveSection(sectionId);
    // append text to that section's notes field
    const raw   = sb[sectionId] || {};
    const data  = (sectionId === 'process' && Array.isArray(raw)) ? { cards: raw, notes: '' } : raw;
    const notes = data.notes || '';
    handleChange(sectionId, { ...data, notes: notes ? notes + '\n\n' + text : text });
  };

  return (
    <div className="story-builder">

      {/* Top: section nav strip */}
      <div className="story-builder-topbar">
        <SectionNav
          activeId={activeSection}
          onSelect={setActiveSection}
          onDropMoment={handleDropMoment}
          storyBuilder={sb}
        />
        <div className="story-builder-topbar-right">
          <div className="story-completeness-wrap">
            <div className="story-completeness-bar">
              <div className="story-completeness-fill" style={{ width: `${completeness}%` }} />
            </div>
            <span className="story-completeness-pct">{completeness}%</span>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="story-builder-editor-col">
        <SectionEditor
          key={activeSection}
          sectionId={activeSection}
          storyBuilder={sb}
          onChange={handleChange}
        />
      </div>

    </div>
  );
}
