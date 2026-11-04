import React, { useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { NAV_ITEMS, isNavActive } from './navItems';

interface HeaderMobileMenuProps {
  id: string;
  currentPath: string;
  completedCount: number;
  onNavigate: (path: string) => void;
  onOpenCheatSheet: () => void;
  onClose: (restoreFocus: boolean) => void;
}

/** Dropdown navigation used below the xl breakpoint, replacing the old clipped horizontal scroller. */
export const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = ({
  id,
  currentPath,
  completedCount,
  onNavigate,
  onOpenCheatSheet,
  onClose,
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!ref.current?.contains(target) && !target.closest('[data-menu-toggle]')) onClose(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onClose]);

  const itemClass = (active: boolean) =>
    `clay-menu-item flex items-center gap-2 px-4 rounded-full text-[0.875rem] font-bold cursor-pointer ${
      active ? 'clay-btn-pink text-white' : 'clay-well text-[var(--dp-color-ink)]'
    }`;

  return (
    <nav id={id} ref={ref} aria-label="Site sections" className="max-w-[76rem] mx-auto mt-2 p-3 clay-navbar xl:hidden clay-menu-panel">
      <ul className="grid grid-cols-1 min-[26rem]:grid-cols-2 gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.path, currentPath);
          return (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => onNavigate(item.path)}
                aria-current={active ? 'page' : undefined}
                className={`${itemClass(active)} w-full`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => {
              onClose(false);
              onOpenCheatSheet();
            }}
            className="clay-menu-item clay-cushion-warm w-full flex items-center gap-2 px-4 rounded-full text-[0.875rem] font-bold cursor-pointer"
          >
            <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Cheat Sheet</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => onNavigate('/learn')}
            className="clay-menu-item clay-cushion-mint w-full flex items-center gap-2 px-4 rounded-full text-[0.875rem] font-bold cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{completedCount}/35 lessons</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};
