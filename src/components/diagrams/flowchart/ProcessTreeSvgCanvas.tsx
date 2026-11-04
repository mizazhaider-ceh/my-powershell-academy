import React from 'react';
import { ProcessTreeNode } from '../../../utils/flowchartModels';

interface ProcessTreeSvgCanvasProps {
  processNodes: ProcessTreeNode[];
  activeProcessId: string;
  lineageSet: Set<string>;
  onSelectProcess: (id: string) => void;
}

export const ProcessTreeSvgCanvas: React.FC<ProcessTreeSvgCanvasProps> = ({
  processNodes,
  activeProcessId,
  lineageSet,
  onSelectProcess,
}) => {
  return (
    <div className="clay-well p-4 sm:p-5 overflow-x-auto">
      <svg
        viewBox="0 0 980 495"
        className="w-full min-w-[48rem] h-auto select-none"
        role="img"
        aria-label="Interactive Windows Process Tree SVG Flowchart showing Ring 0 and Ring 3 parent-child process hierarchy"
      >
        <defs>
          <filter id="procNodeShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.16" />
          </filter>
        </defs>

        <rect x="16" y="10" width="948" height="78" rx="20" fill="#dbeafe" opacity="0.7" />
        <text x="32" y="36" fontSize="10.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#1e3a8a">
          RING 0 · KERNEL MODE (ntoskrnl.exe)
        </text>
        <text x="32" y="54" fontSize="10" fontWeight="600" fontFamily="Instrument Sans, sans-serif" fill="#334155">
          EPROCESS blocks, Tokens &amp; Page Tables
        </text>

        <line x1="16" y1="96" x2="964" y2="96" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="8 4" />
        <rect x="32" y="86" width="264" height="20" rx="10" fill="#1d4ed8" />
        <text x="164" y="99" textAnchor="middle" fontSize="9.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#ffffff">
          RING 3 USER MODE BOUNDARY (NTDLL.DLL)
        </text>

        <rect x="16" y="196" width="436" height="290" rx="22" fill="#e0e7ff" opacity="0.45" />
        <text x="32" y="218" fontSize="10" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#1e3a8a">
          SESSION 0 · SYSTEM SERVICES &amp; DAEMONS
        </text>

        <rect x="468" y="196" width="496" height="290" rx="22" fill="#f0fdf4" opacity="0.55" />
        <text x="486" y="218" fontSize="10" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#065f46">
          SESSION 1 · INTERACTIVE DESKTOP &amp; POWERSHELL
        </text>

        {processNodes.map((node) => {
          if (!node.parentId) return null;
          const parent = processNodes.find((p) => p.id === node.parentId);
          if (!parent) return null;

          const isEdgeInLineage = lineageSet.has(node.id) && lineageSet.has(parent.id);
          const startX = parent.x;
          const startY = parent.y + 28;
          const endX = node.x;
          const endY = node.y - 28;
          const midY = (startY + endY) / 2;
          const edgeStroke = node.isSuspicious ? '#dc2626' : isEdgeInLineage ? '#1d4ed8' : '#64748b';

          return (
            <g key={`edge-${parent.id}-${node.id}`}>
              <path
                d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                fill="none"
                stroke={edgeStroke}
                strokeWidth={isEdgeInLineage || node.isSuspicious ? '3.25' : '1.75'}
                strokeDasharray={node.isSuspicious ? '6 3' : undefined}
              />
              <circle cx={endX} cy={endY} r="4" fill={edgeStroke} />
            </g>
          );
        })}

        {processNodes.map((node) => {
          const isSelected = node.id === activeProcessId;
          const isInLineage = lineageSet.has(node.id);
          const boxWidth = 176;
          const boxHeight = 56;
          const boxX = node.x - boxWidth / 2;
          const boxY = node.y - boxHeight / 2;

          let fill = '#ffffff';
          let stroke = '#0f172a';
          let badgeFill = '#e2e8f0';
          let badgeText = '#0f172a';

          if (node.isSuspicious) {
            fill = isSelected ? '#fecaca' : '#fef3c7';
            stroke = '#dc2626';
            badgeFill = '#dc2626';
            badgeText = '#ffffff';
          } else if (isSelected) {
            fill = '#bfdbfe';
            stroke = '#1d4ed8';
            badgeFill = '#1d4ed8';
            badgeText = '#ffffff';
          } else if (isInLineage) {
            fill = '#dbeafe';
            stroke = '#2563eb';
            badgeFill = '#2563eb';
            badgeText = '#ffffff';
          } else if (node.ring === 'Ring 0') {
            fill = '#c5e5fb';
          }

          return (
            <g
              key={node.id}
              onClick={() => onSelectProcess(node.id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Inspect process ${node.name} (PID ${node.pid}, PPID ${node.ppid})`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProcess(node.id);
                }
              }}
            >
              <rect
                x={boxX}
                y={boxY}
                width={boxWidth}
                height={boxHeight}
                rx="16"
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? '3' : '1.75'}
                filter="url(#procNodeShadow)"
              />
              <text x={boxX + 12} y={boxY + 22} fontSize="12" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#0f172a">
                {node.name}
              </text>
              <rect x={boxX + boxWidth - 64} y={boxY + 8} width="54" height="18" rx="9" fill={badgeFill} />
              <text x={boxX + boxWidth - 37} y={boxY + 20} textAnchor="middle" fontSize="9.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill={badgeText}>
                PID {node.pid}
              </text>
              <text x={boxX + 12} y={boxY + 42} fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="#334155">
                PPID: {node.ppid} · Sess {node.sessionId} · {node.workingSetMB}MB
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
