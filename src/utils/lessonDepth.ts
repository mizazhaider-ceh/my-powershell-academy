import { useSyncExternalStore } from 'react';

export type LessonDepth = 'core' | 'full';

const STORAGE_KEY = 'ps_academy_lesson_depth';
const listeners = new Set<() => void>();

function readStored(): LessonDepth {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'full' ? 'full' : 'core';
  } catch {
    return 'core';
  }
}

let current: LessonDepth = typeof window === 'undefined' ? 'core' : readStored();

export function setLessonDepth(next: LessonDepth): void {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable; the choice simply lasts for this session.
  }
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Core path (default) shows the guided route; Full depth adds the long reference sections. */
export function useLessonDepth(): LessonDepth {
  return useSyncExternalStore(subscribe, () => current, () => 'core' as LessonDepth);
}
