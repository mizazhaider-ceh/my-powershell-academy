import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CommandEntry } from '../../types';
import { commandReference } from '../../data/commands';
import { CodeBlock } from '../common/CodeBlock';

interface CommandInspectorSheetProps {
  activeCommand: CommandEntry;
  onSelectCommand: (cmd: CommandEntry) => void;
  onNavigate: (path: string) => void;
}

export const CommandInspectorSheet: React.FC<CommandInspectorSheetProps> = ({
  activeCommand,
  onSelectCommand,
  onNavigate,
}) => {
  return (
    <div className="pt-6 border-t border-black/10 dark:border-white/10 space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[0.75rem] font-mono font-bold">
          <span className="px-3 py-1 rounded-full clay-pill">
            Module: {activeCommand.module}
          </span>
          {activeCommand.isEssentialPocketknife && (
            <span className="px-3 py-1 rounded-full clay-cushion-warm">
              ★ Self-Reliance Pocketknife Cmdlet
            </span>
          )}
        </div>

        <h2 className="text-[1.875rem] sm:text-[2.25rem] font-bold font-mono">
          {activeCommand.name}
        </h2>
        <p className="text-[1.125rem] font-bold">{activeCommand.purpose}</p>
        <p className="text-[1rem] opacity-90 leading-relaxed">
          {activeCommand.description}
        </p>
      </div>

      <div className="space-y-2">
        <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
          1 · Syntax Signature
        </span>
        <CodeBlock code={activeCommand.syntax} language="powershell" />
      </div>

      <div className="space-y-2.5">
        <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
          2 · Parameters &amp; Pipeline Binding (ByValue vs ByPropertyName)
        </span>
        <div className="overflow-x-auto clay-well p-3">
          <table className="w-full text-[0.875rem] text-left">
            <thead className="font-mono text-[0.75rem] uppercase border-b border-black/10 dark:border-white/10">
              <tr>
                <th className="p-3">Parameter</th>
                <th className="p-3">Type</th>
                <th className="p-3">Required</th>
                <th className="p-3">Pipeline Input</th>
                <th className="p-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono">
              {activeCommand.parameters.map((p) => (
                <tr key={p.name}>
                  <td className="p-3 font-bold">
                    {p.name.startsWith('-') ? p.name : `-${p.name}`}
                  </td>
                  <td className="p-3 opacity-80">{p.type}</td>
                  <td className="p-3">
                    {p.required ? <strong>True</strong> : 'False'}
                  </td>
                  <td className="p-3 font-bold">{p.pipelineInput}</td>
                  <td className="p-3 font-sans leading-relaxed">
                    {p.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <span className="text-[0.75rem] font-mono uppercase tracking-wider font-bold opacity-75 block">
          3 · Practical Examples &amp; Expected Output
        </span>
        {activeCommand.practicalExamples.map((ex, i) => (
          <div key={i} className="clay-well p-5 space-y-2">
            <h3 className="text-[1rem] font-bold">{ex.title}</h3>
            <p className="text-[0.9375rem] opacity-85">{ex.description}</p>
            <CodeBlock
              code={ex.code}
              output={ex.output || ex.illustrativeOutput}
              language="powershell"
              showLineNumbers={false}
            />
          </div>
        ))}
      </div>

      <div className="clay-cushion-warm p-5 space-y-1.5">
        <span className="font-mono font-extrabold uppercase tracking-wider text-[0.75rem] block">
          ⚠️ Field Notes &amp; Beginner Troubleshooting
        </span>
        <p className="text-[0.9375rem] leading-relaxed">
          {activeCommand.troubleshooting}
        </p>
      </div>

      <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.75rem] font-mono font-bold opacity-75">
            Related:
          </span>
          {activeCommand.relatedCommands.map((rc) => (
            <button
              key={rc}
              type="button"
              onClick={() => {
                const target = commandReference.find(
                  (c) => c.name.toLowerCase() === rc.toLowerCase()
                );
                if (target) onSelectCommand(target);
              }}
              className="text-[0.75rem] font-mono font-bold px-3 py-1 rounded-full clay-pill cursor-pointer"
            >
              {rc}
            </button>
          ))}
        </div>

        {activeCommand.relatedLessonPath && (
          <button
            type="button"
            onClick={() => onNavigate(activeCommand.relatedLessonPath)}
            className="clay-btn-pink px-4 py-2 text-[0.8125rem] text-[#383139] flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <span>Open Lesson Deep-Dive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
