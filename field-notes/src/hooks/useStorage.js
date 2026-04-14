import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'fieldnotes_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full — fail silently
  }
}

export function useStorage(initialState) {
  const [state, setState] = useState(() => {
    const saved = loadState();
    return saved || initialState;
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
