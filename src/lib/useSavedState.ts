"use client";

import { useEffect, useState } from "react";

// Like useState, but the value is saved to localStorage so it survives a refresh.
// It loads after the first render so server and browser HTML match (no hydration error).
export function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from the browser
      if (saved) setValue(JSON.parse(saved));
    } catch {
      // Private mode or blocked storage: just use the default.
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, loaded]);

  return [value, setValue] as const;
}
