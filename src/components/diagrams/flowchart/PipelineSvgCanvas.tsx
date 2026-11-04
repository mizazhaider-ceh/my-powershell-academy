import React from 'react';
import { FlowchartStageNode } from '../../../types';
import { getStageColors } from './PipelineStageColors';

interface PipelineSvgCanvasProps {
  pipelineTitle: string;
  stages: FlowchartStageNode[];
  selectedStageIdx: number;
  onSelectStage: (idx: number) => void;
}

export const PipelineSvgCanvas: React.FC<PipelineSvgCanvasProps> = ({
  pipelineTitle,
  stages,
  selectedStageIdx,
  onSelectStage,
}) => {
  return (
    <div className="clay-well p-4 sm:p-5 overflow-x-auto">
      <svg
        viewBox="0 0 960 250"
        className="w-full min-w-[46rem] h-auto select-none"
        role="img"
        aria-label={`Interactive SVG flowchart for ${pipelineTitle}`}
      >
        <defs>
          <filter id="clayNodeShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#383139" floodOpacity="0.14" />
          </filter>
          <marker id="flowArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#1d4ed8" />
          </marker>
          <marker id="flowArrowMuted" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#475569" />
          </marker>
        </defs>

        <rect x="18" y="8" width="924" height="26" rx="13" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
        <text x="34" y="25" fontSize="10.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#1e3a8a">
          LIVE .NET OBJECT STREAM (NO TEXT PARSING) · CLICK ANY STAGE NODE TO INSPECT
        </text>
        <text x="926" y="25" textAnchor="end" fontSize="10.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#1d4ed8">
          STAGE {selectedStageIdx + 1} OF {stages.length} ACTIVE
        </text>

        {stages.map((stage, idx) => {
          const x = 18 + idx * 238;
          const y = 50;
          const width = 200;
          const height = 158;
          const isSelected = idx === selectedStageIdx;
          const isPassed = idx <= selectedStageIdx;
          const colors = getStageColors(stage.kind, isSelected);
          const truncLabel = stage.label.length > 24 ? `${stage.label.slice(0, 23)}...` : stage.label;
          const truncSub = stage.sublabel.length > 27 ? `${stage.sublabel.slice(0, 26)}...` : stage.sublabel;
          const truncCmd = stage.commandOrMechanism.length > 25 ? `${stage.commandOrMechanism.slice(0, 24)}...` : stage.commandOrMechanism;
          const truncOut = stage.outputType.length > 24 ? `${stage.outputType.slice(0, 23)}...` : stage.outputType;
          const bindingLabel = idx === 0 ? 'ByValue' : idx === 1 ? 'ByValue' : 'ByPropName';

          return (
            <g key={stage.id}>
              {idx < stages.length - 1 && (
                <g>
                  <line
                    x1={x + width}
                    y1={y + height / 2}
                    x2={x + 234}
                    y2={y + height / 2}
                    stroke={isPassed ? '#1d4ed8' : '#475569'}
                    strokeWidth={isPassed ? '3' : '2'}
                    strokeDasharray="5 3"
                    markerEnd={isPassed ? 'url(#flowArrow)' : 'url(#flowArrowMuted)'}
                  />
                  <rect
                    x={x + width + 4}
                    y={y + height / 2 - 28}
                    width="28"
                    height="18"
                    rx="9"
                    fill={isPassed ? '#1d4ed8' : '#334155'}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  <text x={x + width + 18} y={y + height / 2 - 16} textAnchor="middle" fontSize="11" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#ffffff">
                    |
                  </text>
                  <text x={x + width + 18} y={y + height / 2 + 20} textAnchor="middle" fontSize="8.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#1e3a8a">
                    {bindingLabel}
                  </text>
                </g>
              )}

              <g
                onClick={() => onSelectStage(idx)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Inspect Stage ${stage.stepNumber}: ${stage.label}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(idx);
                  }
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="24"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? '3.25' : '1.75'}
                  filter="url(#clayNodeShadow)"
                />
                <rect x={x + 14} y={y + 14} width="64" height="22" rx="11" fill={colors.badgeFill} />
                <text x={x + 46} y={y + 29} textAnchor="middle" fontSize="10.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill={colors.badgeText}>
                  STEP {stage.stepNumber}
                </text>
                <rect x={x + width - 74} y={y + 14} width="60" height="20" rx="10" fill="#ffffff" opacity="0.85" />
                <text x={x + width - 44} y={y + 27} textAnchor="middle" fontSize="9" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#0f172a">
                  {stage.kind.toUpperCase()}
                </text>
                <text x={x + 14} y={y + 56} fontSize="12.5" fontWeight="700" fontFamily="Instrument Sans, sans-serif" fill={colors.titleFill}>
                  {truncLabel}
                </text>
                <text x={x + 14} y={y + 74} fontSize="10.5" fontWeight="600" fontFamily="Instrument Sans, sans-serif" fill={colors.subFill}>
                  {truncSub}
                </text>
                <rect x={x + 12} y={y + 86} width={width - 24} height="34" rx="11" fill="#fffdf7" stroke="#383139" strokeWidth="1" />
                <text x={x + 20} y={y + 107} fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="#383139">
                  {truncCmd}
                </text>
                <text x={x + 14} y={y + 140} fontSize="9.5" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill={colors.subFill}>
                  Out: {truncOut}
                </text>
              </g>
            </g>
          );
        })}

        <rect x="18" y="224" width="924" height="10" rx="5" fill="#e2e8f0" />
        <rect x="18" y="224" width={Math.round(((selectedStageIdx + 1) / stages.length) * 924)} height="10" rx="5" fill="#1d4ed8" />
      </svg>
    </div>
  );
};
