import React from 'react';
import { Menu, Search } from 'lucide-react';
import { chapters } from '../../data/chapters';
import { lessons } from '../../data/lessons';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { ModeToggle } from '../common/ModeToggle';
import { ThemeId } from '../../theme/themes';
import type { ThemeOrigin } from '../../theme/useTheme';

interface AtlasTopbarProps {
  currentPath: string;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: (origin?: ThemeOrigin) => void;
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId, origin?: ThemeOrigin) => void;
}

const TOP_LEVEL: Record<string, string> = {
  '/': 'Home',
  '/learn': 'Curriculum',
  '/roadmap': 'Roadmap',
  '/commands': 'Cmdlets',
  '/knowledge': 'Practice & Drills',
  '/glossary': 'Glossary',
  '/about': 'About',
};

/** Breadcrumb labels built from the real chapter and lesson data. */
export function buildCrumbs(path: string): string[] {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return ['Home'];
  const root = TOP_LEVEL[`/${parts[0]}`] ?? 'Home';
  if (parts[0] === 'learn' && parts[1]) {
    const chapter = chapters.find((c) => c.id === parts[1] || c.slug === parts[1]);
    const crumbs = [root, chapter ? `Module ${String(chapter.number).padStart(2, '0')}` : parts[1]];
    if (parts[2]) {
      const lesson = lessons.find((l) => l.chapterId === chapter?.id && (l.slug === parts[2] || l.id === parts[2]));
      crumbs.push(lesson ? `Lesson ${lesson.id}` : parts[2]);
    }
    return crumbs;
  }
  if (parts[0] === 'commands' && parts[1]) return [root, decodeURIComponent(parts[1])];
  return [root];
}

export const AtlasTopbar: React.FC<AtlasTopbarProps> = ({
  currentPath,
  onOpenMenu,
  onOpenSearch,
  isDark,
  onToggleTheme,
  theme,
  onSelectTheme,
}) => {
  const crumbs = buildCrumbs(currentPath);

  return (
    <div className="atlas-topbar">
      <button type="button" className="atlas-menu-button tap-target clay-btn-secondary w-8 h-8 place-items-center cursor-pointer" onClick={onOpenMenu} aria-label="Open navigation">
        <Menu className="w-4 h-4" aria-hidden="true" />
      </button>

      <nav className="atlas-crumbs" aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={`${crumb}-${i}`}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === crumbs.length - 1 ? <b>{crumb}</b> : <span>{crumb}</span>}
          </React.Fragment>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button type="button" className="atlas-search tap-target" onClick={onOpenSearch} aria-label="Search lessons, cmdlets and internals (Ctrl+K)">
          <Search className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Search the academy</span>
          <kbd className="ml-auto font-mono text-[0.75rem] px-1.5 py-0.5 rounded bg-[var(--a-hover)]">Ctrl K</kbd>
        </button>
        <ThemeSwitcher theme={theme} onSelectTheme={onSelectTheme} />
        <ModeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </div>
  );
};
