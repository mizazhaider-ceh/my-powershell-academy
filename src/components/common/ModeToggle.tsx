import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ThemeOrigin } from '../../theme/useTheme';

interface ModeToggleProps {
  isDark: boolean;
  onToggle: (origin?: ThemeOrigin) => void;
}

/** Light/dark switch. Reports its own position so the change can reveal in a circle from it. */
export const ModeToggle: React.FC<ModeToggleProps> = ({ isDark, onToggle }) => (
  <button
    type="button"
    onClick={(event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      onToggle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    title={isDark ? 'Light mode' : 'Dark mode'}
    className="theme-mode-toggle tap-target w-8 h-8 rounded-full clay-btn-secondary flex items-center justify-center cursor-pointer shrink-0"
  >
    {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[var(--dp-color-accent)]" />}
  </button>
);
