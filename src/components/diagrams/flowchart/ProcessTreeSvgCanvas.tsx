import React from 'react';
import { ProcessTreeNode } from '../../../utils/flowchartModels';
import { ProcessTreeList } from './ProcessTreeList';

interface ProcessTreeSvgCanvasProps {
  processNodes: ProcessTreeNode[];
  activeProcessId: string;
  lineageSet: Set<string>;
  onSelectProcess: (id: string) => void;
}

const MONO = 'JetBrains Mono, monospace';
const BOX_W = 190;
const BOX_H = 76;

export const ProcessTreeSvgCanvas: React.FC<ProcessTreeSvgCanvasProps> = ({
  processNodes,
  activeProcessId,
  lineageSet,
  onSelectProcess,
}) => {
  return (
    <div className="@container">
      <div className="@min-[52rem]:hidden">
        <ProcessTreeList processNodes={processNodes} activeProcessId={activeProcessId} lineageSet={lineageSet} onSelectProcess={onSelectProcess} />
      </div>

      <div className="clay-well p-4 sm:p-5 hidden @min-[52rem]:block">
        <svg viewBox="0 0 980 504" className="w-full h-auto select-none" role="group" aria-label="Interactive Windows process tree showing Ring 0 and Ring 3 parent and child processes">
          <defs>
            <filter id="procNodeShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.16" />
            </filter>
          </defs>

          <rect x="16" y="6" width="948" height="82" rx="20" fill="var(--fc-band-ring0)" opacity="0.8" />
          <text x="32" y="34" fontSize="14" fontWeight="800" fontFamily={MONO} fill="var(--fc-banner-text)">
            RING 0 · KERNEL MODE (ntoskrnl.exe)
          </text>
          <text x="32" y="58" fontSize="14" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" fill="var(--fc-sub)">
            EPROCESS blocks, Tokens &amp; Page Tables
          </text>

          <line x1="16" y1="96" x2="964" y2="96" stroke="var(--fc-line-on)" strokeWidth="2" strokeDasharray="8 4" />
          <rect x="32" y="84" width="346" height="24" rx="12" fill="var(--fc-pill-on)" />
          <text x="205" y="101" textAnchor="middle" fontSize="14" fontWeight="800" fontFamily={MONO} fill="#ffffff">
            RING 3 USER MODE BOUNDARY (NTDLL.DLL)
          </text>

          <rect x="16" y="196" width="436" height="300" rx="22" fill="var(--fc-band-s0)" opacity="0.6" />
          <text x="32" y="220" fontSize="14" fontWeight="800" fontFamily={MONO} fill="var(--fc-banner-text)">
            SESSION 0 · SYSTEM SERVICES &amp; DAEMONS
          </text>

          <rect x="468" y="196" width="496" height="300" rx="22" fill="var(--fc-band-s1)" opacity="0.7" />
          <text x="486" y="220" fontSize="14" fontWeight="800" fontFamily={MONO} fill="var(--fc-band-s1-text)">
            SESSION 1 · INTERACTIVE DESKTOP &amp; POWERSHELL
          </text>

          {processNodes.map((node) => {
            if (!node.parentId) return null;
            const parent = processNodes.find((p) => p.id === node.parentId);
            if (!parent) return null;

            const isEdgeInLineage = lineageSet.has(node.id) && lineageSet.has(parent.id);
            const startY = parent.y + BOX_H / 2;
            const endY = node.y - BOX_H / 2;
            const midY = (startY + endY) / 2;
            const edgeStroke = node.isSuspicious ? 'var(--fc-bad)' : isEdgeInLineage ? 'var(--fc-line-on)' : 'var(--fc-edge)';

            return (
              <g key={`edge-${parent.id}-${node.id}`} aria-hidden="true">
                <path
                  d={`M ${parent.x} ${startY} C ${parent.x} ${midY}, ${node.x} ${midY}, ${node.x} ${endY}`}
                  fill="none"
                  stroke={edgeStroke}
                  strokeWidth={isEdgeInLineage || node.isSuspicious ? '3.25' : '1.75'}
                  strokeDasharray={node.isSuspicious ? '6 3' : undefined}
                />
                <circle cx={node.x} cy={endY} r="4" fill={edgeStroke} />
              </g>
            );
          })}

          {processNodes.map((node) => {
            const isSelected = node.id === activeProcessId;
            const isInLineage = lineageSet.has(node.id);
            const boxX = node.x - BOX_W / 2;
            const boxY = node.y - BOX_H / 2;

            let fill = 'var(--fc-node-fill)';
            let stroke = 'var(--fc-stroke)';
            let badgeFill = 'var(--fc-node-badge)';
            let badgeText = 'var(--fc-badge-text)';

            if (node.isSuspicious) {
              fill = isSelected ? 'var(--fc-node-bad-selected)' : 'var(--fc-node-bad)';
              stroke = 'var(--fc-bad)';
              badgeFill = '#b91c1c';
              badgeText = '#ffffff';
            } else if (isSelected) {
              fill = 'var(--fc-fill-selected)';
              stroke = 'var(--fc-stroke-selected)';
              badgeFill = 'var(--fc-badge-selected)';
              badgeText = '#ffffff';
            } else if (isInLineage) {
              fill = 'var(--fc-node-lineage)';
              stroke = 'var(--fc-node-lineage-stroke)';
            } else if (node.ring === 'Ring 0') {
              fill = 'var(--fc-node-ring0)';
            }

            return (
              <g
                key={node.id}
                onClick={() => onSelectProcess(node.id)}
                className="cursor-pointer fc-node"
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Inspect process ${node.name} (PID ${node.pid}, PPID ${node.ppid})`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProcess(node.id);
                  }
                }}
              >
                <rect x={boxX} y={boxY} width={BOX_W} height={BOX_H} rx="16" fill={fill} stroke={stroke} strokeWidth={isSelected ? '3' : '1.75'} filter="url(#procNodeShadow)" />
                <text x={boxX + 12} y={boxY + 24} fontSize="14.5" fontWeight="800" fontFamily={MONO} fill="var(--fc-title)">
                  {node.name}
                </text>
                <rect x={boxX + 10} y={boxY + 33} width={BOX_W - 20} height="20" rx="10" fill={badgeFill} />
                <text x={boxX + 18} y={boxY + 48} fontSize="14" fontWeight="800" fontFamily={MONO} fill={badgeText}>
                  PID {node.pid} · PPID {node.ppid}
                </text>
                <text x={boxX + 12} y={boxY + 69} fontSize="14" fontWeight="700" fontFamily={MONO} fill="var(--fc-sub)">
                  S{node.sessionId} · {node.workingSetMB}MB
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
