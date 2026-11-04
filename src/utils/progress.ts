const COMPLETED_LESSONS_KEY = 'ps_academy_completed_lessons_v1';
const LAST_VISITED_LESSON_KEY = 'ps_academy_last_lesson_v1';

export interface LastVisitedLesson {
  chapterId: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonNumber: string;
}

export function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(COMPLETED_LESSONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleLessonCompleted(lessonId: string): string[] {
  const current = getCompletedLessons();
  const exists = current.includes(lessonId);
  const updated = exists ? current.filter(id => id !== lessonId) : [...current, lessonId];
  try {
    window.localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ps-progress-updated'));
  } catch {
    // ignore storage errors
  }
  return updated;
}

export function markLessonCompleted(lessonId: string): string[] {
  const current = getCompletedLessons();
  if (current.includes(lessonId)) return current;
  const updated = [...current, lessonId];
  try {
    window.localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ps-progress-updated'));
  } catch {
    // ignore storage errors
  }
  return updated;
}

export function saveLastVisitedLesson(info: LastVisitedLesson): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LAST_VISITED_LESSON_KEY, JSON.stringify(info));
  } catch {
    // ignore storage errors
  }
}

export function getLastVisitedLesson(): LastVisitedLesson | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LAST_VISITED_LESSON_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastVisitedLesson;
  } catch {
    return null;
  }
}
