import React, { useState, useEffect, useRef } from 'react';
import { emptyStoryFlow } from '../hooks/useStoryFlow.js';
import FlowNav    from './story/FlowNav.jsx';
import FlowEditor from './story/FlowEditor.jsx';

export default function StoryFlowBuilder({ project, moments, onUpdate, onGenerateShowcase }) {
  const [activeMoveId, setActiveMoveId] = useState('human');
  const prefillDone = useRef(false);

  // Normalize storyFlow — falls back to empty if not yet on this project
  const sf = project.storyFlow || emptyStoryFlow();

  // Pre-fill learning.text from project.learning once per project mount
  useEffect(() => {
    if (prefillDone.current) return;
    prefillDone.current = true;
    if (!sf.learning?.text && project.learning) {
      onUpdate({ ...sf, learning: { text: project.learning } });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [learningPrefilled] = useState(() => {
    return !sf.learning?.text && !!project.learning;
  });

  const handleChange = (moveId, val) => {
    onUpdate({ ...sf, [moveId]: val });
  };

  return (
    <div className="story-flow">
      <FlowNav
        activeMoveId={activeMoveId}
        onSelect={setActiveMoveId}
        storyFlow={sf}
        onGenerateShowcase={onGenerateShowcase}
      />
      <FlowEditor
        key={activeMoveId}
        activeMoveId={activeMoveId}
        storyFlow={sf}
        onChange={handleChange}
        moments={moments}
        learningPrefilled={learningPrefilled}
        onNav={setActiveMoveId}
      />
    </div>
  );
}
