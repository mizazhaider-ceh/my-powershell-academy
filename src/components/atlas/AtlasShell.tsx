import React, { useEffect, useState } from 'react';
import { AtlasBackdrop } from './AtlasBackdrop';
import { AtlasSidebar } from './AtlasSidebar';
import { AtlasTopbar } from './AtlasTopbar';
import { AtlasFooter } from './AtlasFooter';
import { CheatSheetModal } from '../common/CheatSheetModal';
import { ThemeId } from '../../theme/themes';
import type { ThemeOrigin } from '../../theme/useTheme';

interface AtlasShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: (origin?: ThemeOrigin) => void;
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId, origin?: ThemeOrigin) => void;
  children: React.ReactNode;
}

/** The Atlas application frame: persistent sidebar, sticky top bar, content, quiet footer. */
export const AtlasShell: React.FC<AtlasShellProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  isDark,
  onToggleTheme,
  theme,
  onSelectTheme,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cheatOpen, setCheatOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [currentPath]);

  useEffect(() => {
    if (!menuOpen) return;
    // Move focus into the drawer on open, and give it back to the menu button on close.
    const opener = document.querySelector<HTMLElement>('.atlas-menu-button');
    document.querySelector<HTMLElement>('.atlas-sidebar .atlas-nav-item')?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [menuOpen]);

  return (
    <div className="atlas-shell" data-menu={menuOpen ? 'open' : 'closed'}>
      <AtlasBackdrop />
      <AtlasSidebar currentPath={currentPath} onNavigate={onNavigate} onOpenCheatSheet={() => setCheatOpen(true)} />
      <div className="atlas-scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />

      <div className="atlas-main">
        <AtlasTopbar
          currentPath={currentPath}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenSearch={onOpenSearch}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          theme={theme}
          onSelectTheme={onSelectTheme}
        />
        <main className="atlas-content">{children}</main>
        <AtlasFooter onNavigate={onNavigate} />
      </div>

      <CheatSheetModal isOpen={cheatOpen} onClose={() => setCheatOpen(false)} />
    </div>
  );
};
