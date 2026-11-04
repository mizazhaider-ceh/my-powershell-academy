import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, BookOpen, Terminal, Hash, ArrowRight, CornerDownLeft } from 'lucide-react';
import { searchAcademyIndex, SearchResult } from '../../utils/searchIndex';
import { useDialogFocus } from './useDialogFocus';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const QUICK_JUMP_TAGS = [
  'NTDLL.DLL', 'LSASS', 'UEFI', 'Get-Command', 'Get-Member',
  'ByPropertyName', 'Server Core', 'Active Directory', 'Kerberoasting', '4104',
];

const LISTBOX_ID = 'search-results-listbox';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useDialogFocus(isOpen, dialogRef, onClose, 'input');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const results = useMemo(() => searchAcademyIndex(query), [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  useEffect(() => {
    document.getElementById(`search-opt-${selectedIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;
  const showList = hasQuery && results.length > 0;
  const choose = (item: SearchResult) => {
    onNavigate(item.path);
    onClose();
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (results.length > 0 ? (p + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (results.length > 0 ? (p - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && showList && results[selectedIndex]) {
      e.preventDefault();
      choose(results[selectedIndex]);
    }
  };

  const getIcon = (type: SearchResult['type']) => {
    const cls = 'w-4 h-4 text-[var(--dp-color-ink)] shrink-0';
    if (type === 'command') return <Terminal className={cls} aria-hidden="true" />;
    if (type === 'glossary') return <Hash className={cls} aria-hidden="true" />;
    return <BookOpen className={cls} aria-hidden="true" />;
  };

  const status = !hasQuery
    ? ''
    : results.length === 0
      ? 'No results'
      : `${results.length} result${results.length === 1 ? '' : 's'} available. Use the up and down arrow keys, then Enter.`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="fixed inset-0 bg-[#383139]/45 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the academy"
        className="relative w-full max-w-[42rem] clay-tray p-4 sm:p-6 overflow-hidden z-10"
      >
        <div className="flex items-center px-4 py-1 clay-well rounded-full mb-4 gap-1">
          <Search className="w-5 h-5 text-[var(--dp-color-ink)] mr-2 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="Search modules, Windows internals and cmdlets"
            aria-expanded={showList}
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={showList ? `search-opt-${selectedIndex}` : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search modules, internals, cmdlets (Get-Command, LSASS, Pipeline)"
            className="w-full min-w-0 py-2 bg-transparent text-[var(--dp-color-ink)] placeholder-[var(--dp-color-ink-secondary)]/80 text-[0.95rem] font-semibold focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="search-icon-btn text-[var(--dp-color-ink-secondary)] hover:text-[var(--dp-color-ink)] cursor-pointer" aria-label="Clear search">
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={onClose} className="search-icon-btn px-3 text-[0.75rem] font-extrabold font-mono rounded-full clay-chip-surface text-[var(--dp-color-ink)] cursor-pointer" aria-label="Close search">
            ESC
          </button>
        </div>

        <div role="status" aria-live="polite" className="sr-only">{status}</div>

        <div className="max-h-[55vh] overflow-y-auto">
          {!hasQuery ? (
            <div className="py-5 px-2 text-center">
              <p className="text-[0.75rem] font-extrabold uppercase tracking-wider text-[var(--dp-color-ink-secondary)] mb-3.5">
                Quick Jump Topics
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_JUMP_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => { setQuery(tag); inputRef.current?.focus(); }}
                    className="search-chip px-3.5 py-2 rounded-full clay-well text-[0.8125rem] font-extrabold font-mono text-[var(--dp-color-ink)] hover:bg-[var(--dp-color-surface-compare)] transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-[var(--dp-color-ink-secondary)] text-[0.95rem] font-medium">
              No matches found for <span className="text-[var(--dp-color-ink)] font-mono font-bold">&quot;{query}&quot;</span>. Try searching for a cmdlet verb, process name, or concept.
            </div>
          ) : (
            <ul id={LISTBOX_ID} role="listbox" aria-label="Search results" className="space-y-2 py-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li
                    key={item.id}
                    id={`search-opt-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => choose(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[1.25rem] text-left transition-all cursor-pointer ${
                      isSelected ? 'clay-cushion-pink' : 'clay-well hover:bg-[var(--dp-color-surface-compare)]'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-4">
                      <div className="mt-1 w-7 h-7 rounded-full clay-chip-surface flex items-center justify-center shrink-0">
                        {getIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-[0.9375rem] text-[var(--dp-color-ink)] truncate font-mono">{item.title}</span>
                          <span className="text-[0.75rem] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full clay-chip-surface text-[var(--dp-color-ink)] shrink-0">{item.badge}</span>
                        </div>
                        <p className="text-[0.8125rem] text-[var(--dp-color-ink-secondary)] font-medium truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform text-[var(--dp-color-ink)] ${isSelected ? 'translate-x-0.5' : 'opacity-50'}`} aria-hidden="true" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[rgba(56,49,57,0.1)] flex items-center justify-between text-[0.75rem] text-[var(--dp-color-ink-secondary)] font-extrabold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3.5 h-3.5 text-[var(--dp-color-ink)]" aria-hidden="true" /> to select
            </span>
            <span>↑↓ to navigate</span>
          </div>
          <span aria-hidden="true">{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
};
