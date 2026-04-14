import React, { useState } from 'react';

export default function VoiceCalibration({ onComplete }) {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

  const handleStart = () => {
    onComplete({ q1, q2, q3 });
  };

  const handleSkip = () => {
    onComplete({});
  };

  return (
    <div className="onboarding">
      <div className="onboarding-logo">field notes</div>
      <h1 className="onboarding-heading">Before we begin, help us find your voice.</h1>
      <p className="onboarding-sub">
        These answers are private. They help the platform write in your voice.
      </p>
      <div className="onboarding-form">
        <input
          className="onboarding-input"
          value={q1}
          onChange={e => setQ1(e.target.value)}
          placeholder="What do you notice first when you walk into a new space?"
        />
        <input
          className="onboarding-input"
          value={q2}
          onChange={e => setQ2(e.target.value)}
          placeholder="What frustrates you most about how things usually work?"
        />
        <input
          className="onboarding-input"
          value={q3}
          onChange={e => setQ3(e.target.value)}
          placeholder="What does a good day at work feel like?"
        />
        <button className="onboarding-btn" onClick={handleStart}>
          Get started
        </button>
        <div className="onboarding-skip" onClick={handleSkip}>
          Skip for now
        </div>
      </div>
    </div>
  );
}
