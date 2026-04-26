import { useState, useEffect, useRef } from 'react';
import { emptyStoryBuilder } from './useStoryBlocks.js';
import { emptyStoryFlow } from './useStoryFlow.js';

const STORAGE_KEY     = 'fieldnotes_v1';
const STORAGE_VERSION = 4; // bump this whenever state shape changes incompatibly

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // If the stored version is older, wipe it — better a clean start than a crash
    if (parsed?.__version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, __version: STORAGE_VERSION }));
  } catch {
    // storage full — fail silently
  }
}

// Merge saved state with initial defaults so new fields added to the app
// are always present, even in older saves that predate them.
function mergeWithInitial(saved, initial) {
  if (!saved) return initial;
  const merged = { ...initial, ...saved };

  // Ensure every project has the current required shape
  if (Array.isArray(merged.projects)) {
    merged.projects = merged.projects.map(p => ({
      ...p,
      storyBuilder: p.storyBuilder ?? emptyStoryBuilder(),
      storyFlow:    p.storyFlow    ?? emptyStoryFlow(),
    }));
  }

  return merged;
}

export function useStorage(initialState) {
  const [state, setState] = useState(() => {
    const saved = loadState();
    return mergeWithInitial(saved, initialState);
  });

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveState(state);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [state]);

  return [state, setState];
}

export function getStoredState() {
  return loadState();
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
