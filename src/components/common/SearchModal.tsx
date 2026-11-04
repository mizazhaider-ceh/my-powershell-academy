import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, BookOpen, Terminal, Hash, ArrowRight, CornerDownLeft } from 'lucide-react';
import { searchAcademyIndex, SearchResult } from '../../utils/searchIndex';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

const QUICK_JUMP_TAGS = [
  'NTDLL.DLL', 'LSASS', 'UEFI', 'Get-Command', 'Get-Member',
  'ByPropertyName', 'Server Core', 'Active Directory', 'Kerberoasting', '4104',
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = useMemo(() => searchAcademyIndex(query), [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((p) => (results.length > 0 ? (p + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((p) => (results.length > 0 ? (p - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        onNavigate(results[selectedIndex].path);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onNavigate, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: SearchResult['type']) => {
    const cls = 'w-4 h-4 text-[var(--dp-color-ink)] shrink-0';
    if (type === 'command') return <Terminal className={cls} />;
    if (type === 'glossary') return <Hash className={cls} />;
    return <BookOpen className={cls} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="fixed inset-0 bg-[#383139]/45 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-[42rem] clay-tray p-4 sm:p-6 overflow-hidden z-10">
        <div className="flex items-center px-4 py-3.5 clay-well rounded-full mb-4">
          <Search className="w-5 h-5 text-[var(--dp-color-ink)] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, Windows internals, cmdlets (e.g., Get-Command, LSASS, NTDLL, Pipeline)..."
            className="w-full bg-transparent text-[var(--dp-color-ink)] placeholder-[var(--dp-color-ink-secondary)]/65 text-[0.95rem] font-semibold focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[var(--dp-color-ink-secondary)] hover:text-[var(--dp-color-ink)] mr-1 cursor-pointer" aria-label="Clear search">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1 text-[0.75rem] font-extrabold font-mono rounded-full bg-white/80 text-[var(--dp-color-ink)] cursor-pointer">
            ESC
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="py-5 px-2 text-center">
              <p className="text-[0.75rem] font-extrabold uppercase tracking-wider text-[var(--dp-color-ink-secondary)] mb-3.5">
                Quick Jump Topics
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_JUMP_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3.5 py-2 rounded-full clay-well text-[0.8125rem] font-extrabold font-mono text-[var(--dp-color-ink)] hover:bg-[var(--dp-color-accent)] transition-colors cursor-pointer"
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
            <div className="space-y-2 py-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.path); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[1.25rem] text-left transition-all cursor-pointer ${
                      isSelected ? 'clay-cushion-pink' : 'clay-well hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 pr-4">
                      <div className="mt-1 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shrink-0">
                        {getIcon(item.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-[0.9375rem] text-[var(--dp-color-ink)] truncate font-mono">{item.title}</span>
                          <span className="text-[0.6875rem] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 text-[var(--dp-color-ink)] shrink-0">{item.badge}</span>
                        </div>
                        <p className="text-[0.8125rem] text-[var(--dp-color-ink-secondary)] font-medium truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform text-[var(--dp-color-ink)] ${isSelected ? 'translate-x-0.5' : 'opacity-50'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[rgba(56,49,57,0.1)] flex items-center justify-between text-[0.75rem] text-[var(--dp-color-ink-secondary)] font-extrabold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3.5 h-3.5 text-[var(--dp-color-ink)]" /> to select
            </span>
            <span>↑↓ to navigate</span>
          </div>
          <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
};
