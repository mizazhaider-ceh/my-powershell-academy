import { BookOpen, Target, Code2, FlaskConical, BookMarked, Info, Rocket, Server, Hammer, LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  group: 'Learn' | 'Practice' | 'Reference';
  /** false keeps the item out of the compact top header (it still appears in the Atlas sidebar). */
  inHeader?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Start here', path: '/start', icon: Rocket, group: 'Learn' },
  { label: 'Curriculum', path: '/learn', icon: BookOpen, group: 'Learn' },
  { label: 'Roadmap', path: '/roadmap', icon: Target, group: 'Learn' },
  { label: 'Practice & Drills', path: '/knowledge', icon: FlaskConical, group: 'Practice' },
  { label: 'Projects', path: '/projects', icon: Hammer, group: 'Practice' },
  { label: 'Lab setup', path: '/lab-setup', icon: Server, group: 'Practice', inHeader: false },
  { label: 'Cmdlets', path: '/commands', icon: Code2, group: 'Practice' },
  { label: 'Glossary', path: '/glossary', icon: BookMarked, group: 'Reference' },
  { label: 'About Izaz', path: '/about', icon: Info, group: 'Reference' },
];

export function isNavActive(itemPath: string, currentPath: string): boolean {
  if (itemPath === '/learn') return currentPath === '/learn' || currentPath.startsWith('/learn/');
  if (itemPath === '/commands') return currentPath === '/commands' || currentPath.startsWith('/commands/');
  if (itemPath === '/projects') return currentPath === '/projects' || currentPath.startsWith('/projects/');
  return currentPath === itemPath;
}
