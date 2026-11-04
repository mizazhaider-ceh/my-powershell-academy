import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Terminal, Sparkles, CheckCircle2, Menu, X } from 'lucide-react';
import { getCompletedLessons } from '../../utils/progress';
import { CheatSheetModal } from './CheatSheetModal';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ModeToggle } from './ModeToggle';
import { HeaderMobileMenu } from './HeaderMobileMenu';
import { NAV_ITEMS, isNavActive } from './navItems';
import { ThemeId } from '../../theme/themes';
import type { ThemeOrigin } from '../../theme/useTheme';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: (origin?: ThemeOrigin) => void;
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId, origin?: ThemeOrigin) => void;
}

const MENU_ID = 'header-site-menu';

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  isDark,
  onToggleTheme,
  theme,
  onSelectTheme,
}) => {
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => setMenuOpen(false), [currentPath]);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header className="clay-header sticky top-0 z-40 w-full pt-3 pb-2 px-3 sm:px-6">
        <div className="max-w-[76rem] mx-auto clay-navbar px-3 sm:px-4 py-2 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-left cursor-pointer group min-w-0 shrink"
          >
            <div className="w-8 h-8 rounded-[0.75rem] clay-btn-pink flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4 text-white stroke-[2.5]" aria-hidden="true" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-[0.8rem] min-[26rem]:text-[0.88rem] sm:text-[0.92rem] leading-tight tracking-tight min-[26rem]:whitespace-nowrap text-[var(--dp-color-ink)]">
                PowerShell Academy
              </span>
              <span className="hidden min-[26rem]:block text-[0.75rem] font-extrabold text-[var(--dp-color-accent)] tracking-tight whitespace-nowrap">
                by Muhammad Izaz Haider
              </span>
            </div>
          </button>

          <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-0.5 shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.path, currentPath);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  aria-current={active ? 'page' : undefined}
                  className={`px-2.5 py-1.5 rounded-full text-[0.75rem] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 transition-all ${
                    active
                      ? 'clay-btn-pink text-white'
                      : 'text-[var(--dp-color-ink-secondary)] hover:text-[var(--dp-color-ink)] hover:bg-[var(--dp-color-ground)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/learn')}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full clay-cushion-mint text-[0.75rem] font-extrabold cursor-pointer whitespace-nowrap shrink-0"
              title="Completed lessons progress"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{completedCount}/35</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCheatSheetOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full clay-cushion-warm text-[0.75rem] font-extrabold cursor-pointer whitespace-nowrap shrink-0"
              title="Open PowerShell Operators & Syntax Cheat Sheet"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Cheat Sheet</span>
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="tap-target clay-well flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full text-[0.75rem] font-bold cursor-pointer shrink-0"
              aria-label="Search lessons, cmdlets and internals (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[var(--dp-color-accent)] shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline text-[var(--dp-color-ink-secondary)] whitespace-nowrap">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[0.75rem] font-mono font-extrabold rounded-full bg-[var(--dp-color-surface-compare)] text-[var(--dp-color-accent)] dark:text-[var(--dp-color-accent-bright)]">
                Ctrl K
              </kbd>
            </button>

            <ThemeSwitcher theme={theme} onSelectTheme={onSelectTheme} />

            <ModeToggle isDark={isDark} onToggle={onToggleTheme} />

            <button
              ref={menuButtonRef}
              type="button"
              data-menu-toggle
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              aria-label={menuOpen ? 'Close site menu' : 'Open site menu'}
              className="tap-target xl:hidden w-8 h-8 rounded-full clay-btn-secondary flex items-center justify-center cursor-pointer shrink-0"
            >
              {menuOpen ? <X className="w-4 h-4" aria-hidden="true" /> : <Menu className="w-4 h-4" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <HeaderMobileMenu
            id={MENU_ID}
            currentPath={currentPath}
            completedCount={completedCount}
            onNavigate={onNavigate}
            onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
            onClose={closeMenu}
          />
        )}
      </header>

      <CheatSheetModal isOpen={isCheatSheetOpen} onClose={() => setIsCheatSheetOpen(false)} />
    </>
  );
};
