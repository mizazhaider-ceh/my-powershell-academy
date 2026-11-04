import React, { useState } from 'react';
import { Box, Play, Database, CheckCircle2 } from 'lucide-react';
import { PROCESS_MEMBERS, MemberItem } from '../../data/diagramData';

export const ObjectAnatomy: React.FC = () => {
  const [filterType, setFilterType] = useState<'All' | 'Property' | 'Method'>(
    'All'
  );
  const [selectedMember, setSelectedMember] = useState<MemberItem>(
    PROCESS_MEMBERS[0]
  );

  const filtered = PROCESS_MEMBERS.filter(
    (m) => filterType === 'All' || m.type === filterType
  );

  return (
    <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Interactive Object Anatomy: System.Diagnostics.Process
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Click any member below to inspect its behavior, type definition, and
            invocation syntax.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
          {(['All', 'Property', 'Method'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                filterType === t
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {t === 'All' ? 'All Members' : `${t}ies`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4">
        <div className="md:col-span-5 space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
          {filtered.map((item) => {
            const isSelected = selectedMember.name === item.name;
            const isProp = item.type === 'Property';
            return (
              <div
                key={item.name}
                onClick={() => setSelectedMember(item)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer font-mono transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-purple-400 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {isProp ? (
                    <Database className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  )}
                  <span className="font-semibold truncate">{item.name}</span>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                    isProp
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {item.type}
                </span>
              </div>
            );
          })}
        </div>

        <div className="md:col-span-7 bg-stone-50 dark:bg-stone-950/70 p-4 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-stone-600 dark:text-stone-400 font-semibold tracking-wider">
                  Member Inspector
                </span>
                <h4 className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100">
                  {selectedMember.name}
                </h4>
              </div>
              <span className="text-xs font-mono text-stone-600 dark:text-stone-400">
                {selectedMember.type}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-600 dark:text-stone-400 text-[11px] block mb-1">
                  .NET Definition:
                </span>
                <code className="font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-1 rounded block border border-purple-200/50 dark:border-purple-900/50">
                  {selectedMember.definition}
                </code>
              </div>

              <div>
                <span className="text-stone-600 dark:text-stone-400 text-[11px] block mb-1">
                  Description:
                </span>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {selectedMember.explanation}
                </p>
              </div>

              <div>
                <span className="text-stone-600 dark:text-stone-400 text-[11px] block mb-1">
                  Sample Live Output or Action:
                </span>
                <div className="font-mono text-stone-800 dark:text-stone-200 bg-stone-200/60 dark:bg-stone-900 p-2 rounded">
                  {selectedMember.sampleValueOrAction}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-mono text-stone-600 dark:text-stone-400 block mb-1">
              Example PowerShell Invocations:
            </span>
            <div className="flex items-center justify-between bg-stone-900 text-stone-100 p-2.5 rounded-lg font-mono text-xs">
              <code>{selectedMember.exampleCall}</code>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
