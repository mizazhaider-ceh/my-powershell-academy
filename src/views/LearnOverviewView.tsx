import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, FileText } from 'lucide-react';
import { chapters } from '../data/chapters';
import { TrackCategory } from '../types';
import { ModuleIllustration } from '../components/diagrams/ModuleIllustration';

interface LearnOverviewViewProps {
  onNavigate: (path: string) => void;
}

export const LearnOverviewView: React.FC<LearnOverviewViewProps> = ({
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'All' | TrackCategory>('All');

  const filteredChapters =
    filter === 'All' ? chapters : chapters.filter((c) => c.track === filter);

  const tabs: { id: 'All' | TrackCategory; label: string }[] = [
    { id: 'All', label: 'All 16 Modules' },
    { id: 'Windows Internals', label: '1. Windows Internals' },
    { id: 'Advanced Object Pipeline', label: '2. Advanced Object Pipeline' },
    { id: 'Systems & Fleet Automation', label: '3. Systems & Fleet Automation' },
    { id: 'PowerShell for Ethical Hackers', label: '4. Ethical Hackers & Defense' },
  ];

  return (
    <div className="max-w-[68rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
      {/* PowerShell Deep Blue Opening Cushion */}
      <header className="clay-cushion-pink p-7 sm:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill text-[0.8125rem] font-mono font-extrabold text-[var(--dp-color-accent)]">
          <BookOpen className="w-4 h-4" />
          <span>Created by Muhammad Izaz Haider · Complete Study Guide</span>
        </div>

        <h1 className="text-[2rem] sm:text-[2.75rem] font-extrabold text-[var(--dp-color-ink)] leading-tight">
          A-to-Z Illustrated Engineering Curriculum
        </h1>
        <p className="text-[1.0625rem] text-[var(--dp-color-ink-secondary)] font-medium max-w-[44rem] leading-relaxed">
          Every module follows a clear, step-by-step teaching sequence, explaining
          technical terms and acronyms first, visualizing pipelines and kernel
          structures with custom architecture diagrams, and verifying your
          mastery after every lesson.
        </p>

        {/* Track Filter Pills */}
        <div
          className="flex flex-wrap gap-2 pt-2"
          role="tablist"
          aria-label="Filter curriculum modules by track"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-[0.8125rem] font-extrabold cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'clay-btn-primary'
                  : 'clay-btn-secondary text-[var(--dp-color-ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Shared Tray Containing All 16 Illustrated Modules */}
      <section className="clay-tray p-6 sm:p-10 space-y-6">
        {filteredChapters.map((ch) => (
          <article
            key={ch.id}
            onClick={() => onNavigate(`/learn/${ch.slug}`)}
            className="clay-well p-6 rounded-[2rem] hover:bg-[#e2ebfc] dark:hover:bg-white/5 transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
          >
            {/* Left Column (5 cols): Custom Module Architecture Illustration */}
            <div className="lg:col-span-5">
              <ModuleIllustration moduleNumber={ch.number} />
            </div>

            {/* Right Column (7 cols): Module Info & Direct Lesson Links */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] font-mono font-extrabold">
                <div className="flex items-center gap-2.5">
                  <span className="guide-num-badge">
                    {ch.number < 10 ? `0${ch.number}` : ch.number}
                  </span>
                  <span className="text-[var(--dp-color-accent)]">
                    {ch.track}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full clay-pill">
                    {ch.difficulty}
                  </span>
                  <span className="px-3 py-0.5 rounded-full clay-pill flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ch.estimatedMinutes} min</span>
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-[1.375rem] font-extrabold group-hover:text-[var(--dp-color-accent)] transition-colors">
                  {ch.title}
                </h2>
                <p className="text-[0.9375rem] font-medium text-[var(--dp-color-ink-secondary)]">
                  {ch.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {ch.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`/learn/${ch.slug}/${lesson.slug}`);
                    }}
                    className="clay-card p-3 rounded-[1.125rem] text-left hover:bg-[#dbeafe] dark:hover:bg-white/10 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 shrink-0 text-[var(--dp-color-accent)]" />
                      <span className="text-[0.85rem] font-extrabold truncate">
                        {lesson.id}: {lesson.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
