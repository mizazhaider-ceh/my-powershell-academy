import { useEffect, useRef } from 'react';
import { chapters } from '../data/chapters';
import { lessons } from '../data/lessons';

const STATIC_TITLES: Record<string, string> = {
  '/': 'Home',
  '/start': 'Start here',
  '/lab-setup': 'Lab setup',
  '/projects': 'Projects',
  '/roadmap': 'Roadmap',
  '/learn': 'Curriculum',
  '/commands': 'Cmdlets',
  '/knowledge': 'Practice and drills',
  '/glossary': 'Glossary',
  '/about': 'About',
};

export function titleForPath(path: string): string {
  if (STATIC_TITLES[path]) return STATIC_TITLES[path];
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'learn') {
    const lesson = lessons.find((l) => l.chapterId === parts[1] && (l.slug === parts[2] || l.id === parts[2]));
    if (lesson) return `${lesson.id} ${lesson.title}`;
    const chapter = chapters.find((c) => c.slug === parts[1] || c.id === parts[1]);
    if (chapter) return `Module ${chapter.number}: ${chapter.title}`;
  }
  if (parts[0] === 'commands' && parts[1]) return decodeURIComponent(parts[1]);
  if (parts[0] === 'projects') return 'Projects';
  return 'Page not found';
}

/** Keeps the tab title in step with the route and moves focus to the content after each navigation. */
export function useRouteAnnouncer(cleanPath: string) {
  const first = useRef(true);
  useEffect(() => {
    document.title = `${titleForPath(cleanPath)} | PowerShell Academy`;
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [cleanPath]);
}
