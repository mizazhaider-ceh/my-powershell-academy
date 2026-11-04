import { useCallback, useEffect, useState } from 'react';
import {
  MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  ThemeId,
  readStoredDarkMode,
  readStoredTheme,
} from './themes';

export interface ThemeOrigin {
  x: number;
  y: number;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

/** Runs a DOM update inside a circular View Transition reveal when the browser supports it. */
function revealTransition(update: () => void, origin?: ThemeOrigin) {
  const doc = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!doc.startViewTransition || reduceMotion) {
    update();
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  doc
    .startViewTransition(update)
    .ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => undefined);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(readStoredTheme);
  const [isDark, setIsDark] = useState<boolean>(readStoredDarkMode);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem(MODE_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
  }, [theme, isDark]);

  const setTheme = useCallback((next: ThemeId, origin?: ThemeOrigin) => {
    revealTransition(() => {
      // Apply the DOM change synchronously so the new snapshot is captured.
      document.documentElement.dataset.theme = next;
      setThemeState(next);
    }, origin);
  }, []);

  const toggleMode = useCallback((origin?: ThemeOrigin) => {
    revealTransition(() => {
      const next = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', next);
      setIsDark(next);
    }, origin);
  }, []);

  return { theme, setTheme, isDark, toggleMode };
}
