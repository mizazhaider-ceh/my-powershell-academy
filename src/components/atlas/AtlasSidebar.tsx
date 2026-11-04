import React, { useEffect, useState } from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { NAV_ITEMS, isNavActive } from '../common/navItems';
import { getCompletedLessons } from '../../utils/progress';

interface AtlasSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCheatSheet: () => void;
}

const GROUPS = ['Learn', 'Practice', 'Reference'] as const;
const TOTAL_LESSONS = 35;

export const AtlasSidebar: React.FC<AtlasSidebarProps> = ({ currentPath, onNavigate, onOpenCheatSheet }) => {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const sync = () => setCompleted(getCompletedLessons().length);
    sync();
    window.addEventListener('ps-progress-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('ps-progress-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, [currentPath]);

  return (
    <aside className="atlas-sidebar" aria-label="Primary">
      <button type="button" className="atlas-brand" onClick={() => onNavigate('/')}>
        <span className="atlas-brand-mark">
          <Terminal className="w-4 h-4" strokeWidth={2.5} />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.95rem] font-semibold tracking-tight">PowerShell Academy</span>
          <span className="font-mono text-[0.75rem] text-[var(--a-ink-3)]">by Muhammad Izaz Haider</span>
        </span>
      </button>

      <nav className="space-y-5" aria-label="Sections">
        {GROUPS.map((group) => (
          <div key={group} className="space-y-1">
            <div className="atlas-group-label">{group.toLowerCase()}</div>
            {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.path, currentPath);
              return (
                <button
                  key={item.path}
                  type="button"
                  className="atlas-nav-item"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => onNavigate(item.path)}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
        <button type="button" className="atlas-nav-item" onClick={onOpenCheatSheet}>
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Cheat sheet
        </button>
      </nav>

      <div className="atlas-sidebar-foot space-y-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[0.78rem] font-medium">Your progress</span>
          <span className="font-mono text-[0.75rem] text-[var(--a-ink-3)]">
            {completed}/{TOTAL_LESSONS}
          </span>
        </div>
        <div className="hx-meter" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL_LESSONS} aria-valuenow={completed}>
          <i style={{ width: `${(completed / TOTAL_LESSONS) * 100}%` }} />
        </div>
        <p className="text-[0.75rem] leading-snug text-[var(--a-ink-3)]">
          {completed === 0 ? 'Finish a lesson quiz to start your streak.' : 'Complete every quiz to finish a module.'}
        </p>
      </div>
    </aside>
  );
};
