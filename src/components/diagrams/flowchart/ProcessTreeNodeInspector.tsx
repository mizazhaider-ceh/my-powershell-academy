import React from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { ProcessTreeNode } from '../../../utils/flowchartModels';

interface ProcessTreeNodeInspectorProps {
  activeProcessNode: ProcessTreeNode;
  copiedCmd: boolean;
  onCopyCommand: (cmd: string) => void;
}

export const ProcessTreeNodeInspector: React.FC<ProcessTreeNodeInspectorProps> = ({
  activeProcessNode,
  copiedCmd,
  onCopyCommand,
}) => {
  return (
    <div
      className={`p-5 sm:p-6 rounded-[1.75rem] space-y-4 ${
        activeProcessNode.isSuspicious ? 'clay-cushion-warm' : 'clay-card'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="guide-num-badge">PID {activeProcessNode.pid}</span>
          <h3 className="text-[1.25rem] font-mono font-bold">{activeProcessNode.name}</h3>
          <span className="px-3 py-0.5 rounded-full clay-pill text-[0.75rem] font-mono font-bold">
            PPID: {activeProcessNode.ppid}
          </span>
          <span className="px-3 py-0.5 rounded-full clay-pill text-[0.75rem] font-mono font-bold">
            {activeProcessNode.ring} · {activeProcessNode.integrityLevel} Integrity
          </span>
        </div>

        <button
          type="button"
          onClick={() => onCopyCommand(activeProcessNode.powershellQuery)}
          className="clay-btn-secondary px-3.5 py-1.5 rounded-full text-[0.75rem] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
        >
          {copiedCmd ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied Query!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy PowerShell Query</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[0.98rem] leading-relaxed font-medium">{activeProcessNode.roleSummary}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[0.75rem] font-mono">
        <div className="clay-well p-3.5 rounded-[1.125rem]">
          <span className="opacity-70 block uppercase">Expected Parent</span>
          <span className="font-bold mt-0.5 block">{activeProcessNode.expectedParent}</span>
        </div>
        <div className="clay-well p-3.5 rounded-[1.125rem]">
          <span className="opacity-70 block uppercase">Session &amp; Memory</span>
          <span className="font-bold mt-0.5 block">
            Session {activeProcessNode.sessionId} · {activeProcessNode.workingSetMB} MB RAM
          </span>
        </div>
        <div className="clay-well p-3.5 rounded-[1.125rem]">
          <span className="opacity-70 block uppercase">Threads &amp; Handles</span>
          <span className="font-bold mt-0.5 block">
            {activeProcessNode.threads} Threads · {activeProcessNode.handles} Handles
          </span>
        </div>
        <div className="clay-well p-3.5 rounded-[1.125rem]">
          <span className="opacity-70 block uppercase">Image Disk Path</span>
          <span className="font-bold mt-0.5 block truncate" title={activeProcessNode.executablePath}>
            {activeProcessNode.executablePath}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
        <div className="clay-cushion-cool p-4 rounded-[1.25rem] text-[0.85rem] space-y-1">
          <span className="font-mono text-[0.75rem] font-extrabold uppercase tracking-wider block">
            🔍 Blue Team Forensic Verification Rule
          </span>
          <p className="leading-relaxed">{activeProcessNode.forensicNote}</p>
        </div>

        <div className="p-4 rounded-[1.25rem] bg-[#0f172a] text-[#e2e8f0] font-mono text-[0.78rem] space-y-1.5 flex flex-col justify-center">
          <span className="text-[0.75rem] uppercase tracking-wider text-blue-300 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Inspect in PowerShell:</span>
          </span>
          <code className="block overflow-x-auto whitespace-nowrap">{activeProcessNode.powershellQuery}</code>
        </div>
      </div>
    </div>
  );
};
