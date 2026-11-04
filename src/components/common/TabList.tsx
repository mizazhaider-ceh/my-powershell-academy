import React, { useRef } from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
}

interface TabListProps {
  idPrefix: string;
  label: string;
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName: (active: boolean) => string;
}

/** Props for the single tab panel that every tab of a TabList controls. */
export const tabPanelProps = (idPrefix: string, activeId: string) => ({
  role: 'tabpanel' as const,
  id: `${idPrefix}-panel`,
  'aria-labelledby': `${idPrefix}-tab-${activeId}`,
  tabIndex: 0,
});

/** WAI-ARIA tabs: roving tabindex, Left/Right/Home/End, automatic activation. */
export const TabList: React.FC<TabListProps> = ({ idPrefix, label, tabs, activeId, onChange, className, tabClassName }) => {
  const listRef = useRef<HTMLDivElement>(null);

  const go = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    onChange(next.id);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[(index + tabs.length) % tabs.length]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      go(moves[event.key]);
    }
  };

  return (
    <div ref={listRef} role="tablist" aria-label={label} className={className}>
      {tabs.map((tab, index) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            id={`${idPrefix}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`tap-target ${tabClassName(active)}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
