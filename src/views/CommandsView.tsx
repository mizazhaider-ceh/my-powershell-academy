import React, { useState } from 'react';
import { Search, Code2, Sparkles, X } from 'lucide-react';
import { commandReference } from '../data/commands';
import { CommandEntry } from '../types';
import { CommandInspectorSheet } from '../components/commands/CommandInspectorSheet';

interface CommandsViewProps {
  initialCmdlet?: string;
  onNavigate: (path: string) => void;
}

export const CommandsView: React.FC<CommandsViewProps> = ({
  initialCmdlet,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedVerb, setSelectedVerb] = useState<string>('all');
  const [pocketknifeOnly, setPocketknifeOnly] = useState<boolean>(false);
  const [activeCommand, setActiveCommand] = useState<CommandEntry | null>(
    () => {
      if (initialCmdlet) {
        const match = commandReference.find(
          (c) => c.name.toLowerCase() === initialCmdlet.toLowerCase()
        );
        if (match) return match;
      }
      return commandReference[0] || null;
    }
  );

  const verbs = Array.from(new Set(commandReference.map((c) => c.verb))).sort();

  const filteredCommands = commandReference.filter((c) => {
    if (pocketknifeOnly && !c.isEssentialPocketknife) return false;
    if (selectedVerb !== 'all' && c.verb !== selectedVerb) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.purpose.toLowerCase().includes(q) ||
        c.syntax.toLowerCase().includes(q) ||
        c.noun.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-[60rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
      <header className="clay-cushion-pink p-7 sm:p-10 space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-pill text-[0.8125rem] font-mono font-extrabold text-[var(--dp-color-accent)]">
          <Code2 className="w-4 h-4" />
          <span>Interactive Cmdlet Reference · By Muhammad Izaz Haider</span>
        </div>
        <h1 className="text-[2rem] sm:text-[2.625rem] font-extrabold text-[var(--dp-color-ink)] leading-tight">
          Core &amp; Security Cmdlet Library
        </h1>
        <p className="text-[1.0625rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
          Every cmdlet follows the <strong>Verb-SingularNoun</strong> law.
          Select any cmdlet below to inspect its syntax, parameter binding
          (ByValue vs ByPropertyName), copy-ready examples, and common traps.
        </p>

        <div className="clay-cushion-warm p-5 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-[0.9375rem]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>🧰 The Self-Reliance Pocketknife Cmdlets (*)</span>
          </div>
          <p className="text-[0.9375rem] leading-relaxed">
            <code>Get-Help</code>, <code>Update-Help</code>,{' '}
            <code>Get-Command</code>, and <code>Get-Member</code> are marked
            with <strong>*</strong>. Master these four and you can figure out
            any other command offline.
          </p>
        </div>
      </header>

      <section className="clay-tray p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 opacity-60 absolute left-4 top-3.5" />
            <input
              type="text"
              aria-label="Filter cmdlets by name, noun, or purpose"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cmdlets (e.g., Get-Service, Get-ADUser, Where-Object)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full clay-well text-[0.9375rem]"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-3 opacity-70 hover:opacity-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by Verb"
              value={selectedVerb}
              onChange={(e) => setSelectedVerb(e.target.value)}
              className="px-4 py-2.5 rounded-full clay-well text-[0.8125rem] font-mono font-bold cursor-pointer"
            >
              <option value="all">All Verbs</option>
              {verbs.map((v) => (
                <option key={v} value={v}>
                  {v}-
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setPocketknifeOnly(!pocketknifeOnly)}
              className={`px-4 py-2.5 rounded-full text-[0.8125rem] font-extrabold flex items-center gap-1.5 cursor-pointer ${
                pocketknifeOnly
                  ? 'clay-btn-primary text-white'
                  : 'clay-btn-secondary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pocketknife (*)</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[0.75rem] font-mono font-extrabold uppercase opacity-75 block">
            Select a Cmdlet ({filteredCommands.length} matching):
          </span>
          <div className="clay-well p-4 flex flex-wrap gap-2 max-h-[13.5rem] overflow-y-auto">
            {filteredCommands.map((cmd) => {
              const isSelected = activeCommand?.name === cmd.name;
              return (
                <button
                  key={cmd.name}
                  type="button"
                  onClick={() => setActiveCommand(cmd)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-[0.8125rem] font-extrabold cursor-pointer transition-all ${
                    isSelected
                      ? 'clay-btn-primary text-white'
                      : 'clay-card hover:bg-blue-500/10'
                  }`}
                >
                  {cmd.name}
                  {cmd.isEssentialPocketknife ? ' *' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {activeCommand ? (
          <CommandInspectorSheet
            activeCommand={activeCommand}
            onSelectCommand={setActiveCommand}
            onNavigate={onNavigate}
          />
        ) : (
          <div className="p-8 text-center opacity-75">
            Select a cmdlet above to view its full guide.
          </div>
        )}
      </section>
    </div>
  );
};
