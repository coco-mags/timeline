import { useState, useEffect } from 'react';

const ACCENT_KEY = 'fieldnotes_accent';

function applyAccent(id) {
  document.documentElement.setAttribute('data-accent', id);
}

export function useAccent() {
  const [currentAccent, setCurrentAccentState] = useState(() => {
    return localStorage.getItem(ACCENT_KEY) || 'ink';
  });

  useEffect(() => {
    applyAccent(currentAccent);
  }, [currentAccent]);

  const setAccent = (id) => {
    localStorage.setItem(ACCENT_KEY, id);
    applyAccent(id);
    setCurrentAccentState(id);
  };

  return { currentAccent, setAccent };
}
