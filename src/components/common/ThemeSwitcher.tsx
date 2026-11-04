import React, { useEffect, useRef, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { THEMES, ThemeId, getThemeMeta } from '../../theme/themes';
import type { ThemeOrigin } from '../../theme/useTheme';

interface ThemeSwitcherProps {
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId, origin?: ThemeOrigin) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, onSelectTheme }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    wrapperRef.current?.querySelector<HTMLElement>('.theme-option-active, .theme-option')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (id: ThemeId, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOpen(false);
    triggerRef.current?.focus();
    if (id !== theme) {
      onSelectTheme(id, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Choose visual theme. Current theme: ${getThemeMeta(theme).name}`}
        title="Visual theme"
        className="theme-switcher-trigger tap-target w-8 h-8 rounded-full clay-btn-secondary flex items-center justify-center cursor-pointer"
      >
        <Palette className="w-4 h-4 text-[var(--dp-color-accent)]" />
      </button>

      {open && (
        <div role="dialog" aria-label="Visual themes" className="theme-popover clay-tray absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[19rem] p-3 space-y-2">
          <p className="px-2 pt-1 text-[0.75rem] font-mono font-extrabold uppercase tracking-widest text-[var(--dp-color-ink-secondary)]">
            Visual theme
          </p>
          {THEMES.map((item) => {
            const active = item.id === theme;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(event) => choose(item.id, event)}
                aria-pressed={active}
                className={`theme-option w-full text-left p-2.5 rounded-2xl flex gap-3 items-center cursor-pointer ${active ? 'theme-option-active' : ''}`}
              >
                <span className="theme-option-preview shrink-0" style={{ background: item.previewBackground }} aria-hidden="true">
                  <span className="theme-option-preview-card" style={{ background: item.previewSurface }} />
                  <span className="theme-option-preview-pill" style={{ background: item.previewAccent }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[0.85rem] font-extrabold text-[var(--dp-color-ink)]">
                    {item.name}
                    {active && <Check className="w-3.5 h-3.5 text-[var(--dp-color-accent)]" />}
                  </span>
                  <span className="block text-[0.75rem] leading-snug font-medium text-[var(--dp-color-ink-secondary)]">{item.tagline}</span>
                  <span className="mt-1.5 flex items-center gap-1">
                    {item.swatches.map((color) => (
                      <span key={color} className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    ))}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
