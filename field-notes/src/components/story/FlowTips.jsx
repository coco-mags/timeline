import React from 'react';
import { FLOW_TIPS } from '../../data/flowTips.js';

export default function FlowTips({ activeMoveId }) {
  const tips = FLOW_TIPS[activeMoveId];
  if (!tips) return <div className="flow-tips" />;

  return (
    <div className="flow-tips">
      <div className="flow-tips-label">From great portfolios</div>

      <div className="flow-tips-cards">
        {tips.examples.map((ex, i) => (
          <div
            key={i}
            className="flow-tip-card"
            style={{ background: ex.bgColor }}
          >
            <span className="flow-tip-name" style={{ color: ex.textColor }}>{ex.name}</span>
            <p className="flow-tip-text">"{ex.text}"</p>
          </div>
        ))}
      </div>

      <div className="flow-tip-what-works">
        <span className="flow-tip-what-label">What works here</span>
        <p className="flow-tip-what-text">{tips.whatWorks}</p>
      </div>
    </div>
  );
}
