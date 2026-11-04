import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ClassicTrapsAccordion } from './ClassicTrapsAccordion';

interface ArchitectureComparisonSectionProps {
  onNavigate: (path: string) => void;
}

export const ArchitectureComparisonSection: React.FC<
  ArchitectureComparisonSectionProps
> = ({ onNavigate }) => {
  return (
    <>
      <section className="clay-tray-lavender p-6 sm:p-10 lg:p-12 space-y-8">
        <div className="space-y-1.5 max-w-[44rem]">
          <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
            Core Architecture Comparisons &amp; Classic Traps
          </span>
          <h2 className="text-[1.75rem] sm:text-[2.125rem] font-extrabold leading-tight">
            What You Need to Know Cold
          </h2>
          <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            These three side-by-side comparisons and four classic traps decide
            whether your commands succeed on the first try on both Windows 11
            and headless Windows Server Core.
          </p>
        </div>

        <div className="space-y-4">
          <div className="clay-cushion-pink p-6 rounded-[2.375rem] grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-4 space-y-1">
              <span className="text-[0.75rem] font-mono font-extrabold uppercase text-[var(--dp-color-accent)]">
                Foundation #1 · Objects vs Text
              </span>
              <h3 className="text-[1.25rem] font-extrabold">
                PowerShell (.NET Objects) vs cmd.exe (Text)
              </h3>
            </div>
            <div className="lg:col-span-5 text-[0.9375rem] font-medium leading-relaxed">
              <strong>cmd.exe</strong> outputs plain text lines you have to cut
              apart. <strong>PowerShell</strong> outputs structured .NET objects
              with real Properties (<code>Name</code>, <code>Status</code>,{' '}
              <code>CanStop</code>) you filter directly with{' '}
              <code>Where-Object</code>.
            </div>
            <div className="lg:col-span-3 flex lg:justify-end">
              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    '/learn/chapter-04/objects-properties-methods'
                  )
                }
                className="clay-btn-primary px-5 py-2.5 text-[0.8125rem] flex items-center gap-2 cursor-pointer"
              >
                <span>Study Module 04</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="clay-card p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-4 space-y-1">
              <span className="text-[0.75rem] font-mono font-extrabold uppercase text-[var(--dp-color-accent)]">
                Foundation #2 · Edition Differences
              </span>
              <h3 className="text-[1.25rem] font-extrabold">
                Windows PowerShell 5.1 vs PowerShell 7.5
              </h3>
            </div>
            <div className="lg:col-span-5 text-[0.9375rem] font-medium leading-relaxed">
              <strong>5.1</strong> is built into Windows Server Core by default
              and only chains with <code>;</code> and <code>|</code> (
              <code>&amp;&amp;</code> and <code>||</code> will fail!).{' '}
              <strong>7.5</strong> runs cross-platform and adds{' '}
              <code>&amp;&amp;</code> / <code>||</code>. Always check{' '}
              <code>$PSVersionTable</code> first.
            </div>
            <div className="lg:col-span-3 flex lg:justify-end">
              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    '/learn/chapter-05/chaining-and-multiline'
                  )
                }
                className="clay-btn-secondary px-5 py-2.5 text-[0.8125rem] flex items-center gap-2 cursor-pointer"
              >
                <span>Study Module 05</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="clay-card p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-4 space-y-1">
              <span className="text-[0.75rem] font-mono font-extrabold uppercase text-[var(--dp-color-accent)]">
                Foundation #3 · CPU Privilege Rings
              </span>
              <h3 className="text-[1.25rem] font-extrabold">
                User Mode (Ring 3) vs Kernel Mode (Ring 0)
              </h3>
            </div>
            <div className="lg:col-span-5 text-[0.9375rem] font-medium leading-relaxed">
              Your apps and PowerShell live in <strong>User Mode</strong> with
              no direct hardware access. Every privileged action crosses{' '}
              <strong>NTDLL.DLL</strong> via a system call into{' '}
              <strong>ntoskrnl.exe</strong> (Executive) where your Access Token
              is checked.
            </div>
            <div className="lg:col-span-3 flex lg:justify-end">
              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    '/learn/chapter-02/user-vs-kernel-mode-syscalls'
                  )
                }
                className="clay-btn-secondary px-5 py-2.5 text-[0.8125rem] flex items-center gap-2 cursor-pointer"
              >
                <span>Study Module 02</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <ClassicTrapsAccordion />
      </section>

      <section className="clay-cushion-pink p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-[40rem]">
          <span className="text-[0.75rem] font-mono font-extrabold uppercase text-[var(--dp-color-accent)]">
            Ready to Practice?
          </span>
          <h2 className="text-[1.5rem] sm:text-[1.875rem] font-extrabold text-[var(--dp-color-ink)]">
            Start with Module 01 or Test Yourself in the Gauntlet
          </h2>
          <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
            Every lesson includes plain-English vocabulary definitions,
            interactive SVG flowcharts, copy-ready scripts, and self-check
            questions with instant explanations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              onNavigate(
                '/learn/chapter-01/windows-evolution-and-least-privilege'
              )
            }
            className="clay-btn-primary px-6 py-3.5 text-[0.9375rem] flex items-center gap-2 cursor-pointer"
          >
            <span>Open Module 01</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/knowledge')}
            className="clay-btn-secondary px-6 py-3.5 text-[0.9375rem] cursor-pointer"
          >
            Practice &amp; Drills
          </button>
        </div>
      </section>
    </>
  );
};
