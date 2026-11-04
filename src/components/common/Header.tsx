import React, { useState, useEffect } from 'react';
import {
  Search, Moon, Sun, BookOpen, Target, Code2, FlaskConical,
  BookMarked, Info, Terminal, Sparkles, CheckCircle2,
} from 'lucide-react';
import { getCompletedLessons } from '../../utils/progress';
import { CheatSheetModal } from './CheatSheetModal';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const NAV_ITEMS = [
  { label: 'Curriculum', path: '/learn', icon: BookOpen },
  { label: 'Roadmap', path: '/roadmap', icon: Target },
  { label: 'Cmdlets', path: '/commands', icon: Code2 },
  { label: 'Practice & Drills', path: '/knowledge', icon: FlaskConical },
  { label: 'Glossary', path: '/glossary', icon: BookMarked },
  { label: 'About Izaz', path: '/about', icon: Info },
];

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  isDark,
  onToggleTheme,
}) => {
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);

  useEffect(() => {
    const syncProgress = () => setCompletedCount(getCompletedLessons().length);
    syncProgress();
    window.addEventListener('ps-progress-updated', syncProgress);
    window.addEventListener('storage', syncProgress);
    return () => {
      window.removeEventListener('ps-progress-updated', syncProgress);
      window.removeEventListener('storage', syncProgress);
    };
  }, [currentPath]);

  const isActive = (path: string) => {
    if (path === '/learn') return currentPath === '/learn' || currentPath.startsWith('/learn/');
    if (path === '/commands') return currentPath === '/commands' || currentPath.startsWith('/commands/');
    return currentPath === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full pt-3 pb-2 px-3 sm:px-6">
        <div className="max-w-[76rem] mx-auto clay-navbar px-3.5 sm:px-4 py-2 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-left cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-[0.75rem] clay-btn-pink flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[0.92rem] leading-tight tracking-tight whitespace-nowrap text-[var(--dp-color-ink)]">
                PowerShell Academy
              </span>
              <span className="text-[0.68rem] font-extrabold text-[var(--dp-color-accent)] tracking-tight whitespace-nowrap">
                by Muhammad Izaz Haider
              </span>
            </div>
          </button>

          <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-0.5 shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className={`px-2.5 py-1.5 rounded-full text-[0.75rem] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 transition-all ${
                    isActive(item.path)
                      ? 'clay-btn-pink text-white'
                      : 'text-[var(--dp-color-ink-secondary)] hover:text-[var(--dp-color-ink)] hover:bg-[var(--dp-color-ground)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/learn')}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full clay-cushion-mint text-[0.72rem] font-extrabold cursor-pointer whitespace-nowrap shrink-0"
              title="Completed lessons progress"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{completedCount}/35</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCheatSheetOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full clay-cushion-warm text-[0.72rem] font-extrabold cursor-pointer whitespace-nowrap shrink-0"
              title="Open PowerShell Operators & Syntax Cheat Sheet"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Cheat Sheet</span>
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="clay-well flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[0.75rem] font-bold cursor-pointer shrink-0"
              aria-label="Search lessons, cmdlets and internals (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--dp-color-accent)] shrink-0" />
              <span className="hidden sm:inline text-[var(--dp-color-ink-secondary)] whitespace-nowrap">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[0.65rem] font-mono font-extrabold rounded-full bg-[var(--dp-color-surface-compare)] text-[var(--dp-color-accent)]">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="w-8 h-8 rounded-full clay-btn-secondary flex items-center justify-center cursor-pointer shrink-0"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[var(--dp-color-accent)]" />}
            </button>
          </div>
        </div>

        <nav aria-label="Mobile navigation" className="xl:hidden max-w-[76rem] mx-auto mt-2 px-3 py-1.5 clay-navbar flex items-center gap-1.5 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`px-3 py-1.5 rounded-full text-[0.75rem] font-bold whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive(item.path) ? 'clay-btn-pink text-white' : 'opacity-85'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsCheatSheetOpen(true)}
            className="px-3 py-1.5 rounded-full text-[0.75rem] font-bold whitespace-nowrap flex items-center gap-1.5 clay-cushion-warm cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cheat Sheet</span>
          </button>
        </nav>
      </header>

      <CheatSheetModal isOpen={isCheatSheetOpen} onClose={() => setIsCheatSheetOpen(false)} />
    </>
  );
};
