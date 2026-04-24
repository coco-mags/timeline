import React from 'react';
import { SECTION_TIPS } from '../../data/sectionTips.js';

export default function SectionTips({ sectionId }) {
  const tips = SECTION_TIPS.find(t => t.sectionId === sectionId);
  if (!tips) return null;

  return (
    <div className="story-tips-inline">
      <div className="story-tips-quotes-row">
        <p className="story-tips-heading">How others opened this section</p>
        <div className="story-tips-quotes">
          {tips.quotes.map((q, i) => (
            <div key={i} className="story-tips-quote" style={{ borderLeft: `2px solid ${q.color}` }}>
              <p className="story-tips-text">"{q.text}"</p>
            </div>
          ))}
        </div>
      </div>
      <div className="story-tips-artifact">
        <span className="story-tips-artifact-label">Artifact idea</span>
        <p className="story-tips-artifact-text">{tips.artifact}</p>
      </div>
    </div>
  );
}
