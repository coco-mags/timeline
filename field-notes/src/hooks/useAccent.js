import { useState, useEffect } from 'react';
import { ACCENTS } from '../data/accents.js';

const ACCENT_KEY = 'fieldnotes_accent';
const THEME_CLASSES = ACCENTS.map(a => a.themeClass).filter(Boolean);

function applyTheme(id) {
  const accent = ACCENTS.find(a => a.id === id) || ACCENTS[0];
  // Remove all theme classes first
  document.documentElement.classList.remove(...THEME_CLASSES);
  // Apply new theme class (empty string for default)
  if (accent.themeClass) {
    document.documentElement.classList.add(accent.themeClass);
  }
}

export function useAccent() {
  const [currentAccent, setCurrentAccentState] = useState(() => {
    return localStorage.getItem(ACCENT_KEY) || 'default';
  });

  useEffect(() => {
    applyTheme(currentAccent);
  }, [currentAccent]);

  const setAccent = (id) => {
    localStorage.setItem(ACCENT_KEY, id);
    applyTheme(id);
    setCurrentAccentState(id);
  };

  return { currentAccent, setAccent };
}
