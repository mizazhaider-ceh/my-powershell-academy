import React, { useState } from 'react';
import { BookMarked, Search, X, ArrowRight } from 'lucide-react';
import { glossaryItems } from '../data/glossary';
import { GlossaryItem } from '../types';

interface GlossaryViewProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ initialQuery = '', onNavigate }) => {
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: (GlossaryItem['category'] | 'all')[] = [
    'all',
    'Windows Internals',
    'Core Concepts',
    'Pipeline & Objects',
    'Scripting & Functions',
    'Administration & Remoting',
    'Active Directory & Networking',
    'Security & Ethical Hacking',
  ];

  const filteredItems = glossaryItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        (item.example && item.example.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-[58rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
      {/* PowerShell Deep Blue Header Cushion */}
      <header className="clay-cushion-pink p-7 sm:p-10 space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill text-[0.8125rem] font-mono font-extrabold text-[var(--dp-color-accent)]">
          <BookMarked className="w-4 h-4" />
          <span>Plain-English Technical Lexicon · By Muhammad Izaz Haider</span>
        </div>
        <h1 className="text-[2rem] sm:text-[2.625rem] font-extrabold text-[var(--dp-color-ink)] leading-tight">
          Windows Internals, Pipeline &amp; Security Glossary
        </h1>
        <p className="text-[1.0625rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
          Clear, beginner-friendly definitions and verified PowerShell examples
          for every kernel, object pipeline, Active Directory, and ethical
          hacking concept in the academy.
        </p>

        {/* Search & Categories */}
        <div className="space-y-4 pt-1">
          <div className="relative max-w-[28rem]">
            <Search className="w-4 h-4 opacity-70 absolute left-4 top-3.5" />
            <input
              type="text"
              aria-label="Search glossary terms"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms, acronyms, or commands..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full clay-pill text-[0.9375rem] text-[var(--dp-color-ink)] placeholder-[var(--dp-color-ink-secondary)]"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-3 text-[var(--dp-color-ink)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[0.75rem] font-extrabold cursor-pointer ${
                  selectedCategory === cat
                    ? 'clay-btn-primary'
                    : 'clay-pill text-[var(--dp-color-ink)]'
                }`}
              >
                {cat === 'all' ? 'All Terms' : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Shared Cream Tray Containing All Terms */}
      <section className="clay-tray p-6 sm:p-10 space-y-5">
        <div className="text-[0.8125rem] font-mono font-bold opacity-75">
          Showing {filteredItems.length} of {glossaryItems.length} terms
        </div>

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <article key={item.term} className="clay-well p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[1.1875rem] font-bold font-mono">
                  {item.term}
                </h2>
                <span className="px-3 py-0.5 rounded-full clay-pill text-[0.75rem] font-mono font-bold">
                  {item.category}
                </span>
              </div>

              <p className="text-[1rem] leading-relaxed">{item.definition}</p>

              {item.example && (
                <div className="p-4 rounded-[1rem] bg-[#141b36] text-[#e8e4d4] font-mono text-[0.8125rem] overflow-x-auto">
                  <pre>
                    <code>{item.example}</code>
                  </pre>
                </div>
              )}

              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-[0.75rem]">
                {item.relatedTerms && item.relatedTerms.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono opacity-75 font-bold">
                      Related:
                    </span>
                    {item.relatedTerms.map((rt) => (
                      <button
                        key={rt}
                        type="button"
                        onClick={() => setSearch(rt)}
                        className="font-mono font-bold underline cursor-pointer"
                      >
                        {rt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div />
                )}

                {item.relatedLessonPath && (
                  <button
                    type="button"
                    onClick={() => onNavigate(item.relatedLessonPath!)}
                    className="font-mono font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
