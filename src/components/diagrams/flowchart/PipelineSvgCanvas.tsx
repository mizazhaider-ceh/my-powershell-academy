import React from 'react';
import { FlowchartStageNode } from '../../../types';
import { getStageColors } from './PipelineStageColors';
import { PipelineStageList } from './PipelineStageList';

interface PipelineSvgCanvasProps {
  pipelineTitle: string;
  stages: FlowchartStageNode[];
  selectedStageIdx: number;
  onSelectStage: (idx: number) => void;
}

const MONO = 'JetBrains Mono, monospace';
const SANS = 'Plus Jakarta Sans, Instrument Sans, sans-serif';
const fit = (text: string, maxChars: number) => (text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text);

export const PipelineSvgCanvas: React.FC<PipelineSvgCanvasProps> = ({
  pipelineTitle,
  stages,
  selectedStageIdx,
  onSelectStage,
}) => {
  const count = stages.length;
  const width = Math.min(188, Math.floor((924 - 56 * (count - 1)) / count));
  const step = count > 1 ? (924 - width) / (count - 1) : 0;
  const y = 44;
  const height = 170;

  return (
    <div className="@container">
      <div className="@min-[52rem]:hidden">
        <PipelineStageList stages={stages} selectedStageIdx={selectedStageIdx} onSelectStage={onSelectStage} />
      </div>

      <div className="clay-well p-4 sm:p-5 hidden @min-[52rem]:block">
        <svg viewBox="0 0 960 248" className="w-full h-auto select-none" role="group" aria-label={`Interactive flowchart for ${pipelineTitle}`}>
          <defs>
            <filter id="clayNodeShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#383139" floodOpacity="0.14" />
            </filter>
            <marker id="flowArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--fc-line-on)" />
            </marker>
            <marker id="flowArrowMuted" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--fc-line-off)" />
            </marker>
          </defs>

          <rect x="18" y="6" width="924" height="28" rx="14" fill="var(--fc-banner-fill)" stroke="var(--fc-banner-stroke)" strokeWidth="1" />
          <text x="34" y="25" fontSize="14" fontWeight="800" fontFamily={MONO} fill="var(--fc-banner-text)">
            LIVE .NET OBJECT STREAM (NO TEXT PARSING) · CLICK A STAGE TO INSPECT
          </text>
          <text x="926" y="25" textAnchor="end" fontSize="14" fontWeight="800" fontFamily={MONO} fill="var(--fc-banner-text-2)">
            STAGE {selectedStageIdx + 1} OF {count}
          </text>

          {stages.map((stage, idx) => {
            const x = 18 + idx * step;
            const isSelected = idx === selectedStageIdx;
            const isPassed = idx <= selectedStageIdx;
            const colors = getStageColors(stage.kind, isSelected);
            const innerChars = (px: number, pad: number) => Math.floor((width - pad) / px);
            const mid = x + width + (step - width) / 2;
            const lineY = y + height / 2;

            return (
              <g key={stage.id}>
                {idx < count - 1 && (
                  <g aria-hidden="true">
                    <line
                      x1={x + width}
                      y1={lineY}
                      x2={x + step - 2}
                      y2={lineY}
                      stroke={isPassed ? 'var(--fc-line-on)' : 'var(--fc-line-off)'}
                      strokeWidth={isPassed ? '3' : '2'}
                      strokeDasharray="5 3"
                      markerEnd={isPassed ? 'url(#flowArrow)' : 'url(#flowArrowMuted)'}
                    />
                    <rect x={mid - 14} y={lineY - 36} width="28" height="22" rx="11" fill={isPassed ? 'var(--fc-pill-on)' : 'var(--fc-pill-off)'} />
                    <text x={mid} y={lineY - 20} textAnchor="middle" fontSize="14" fontWeight="800" fontFamily={MONO} fill="#ffffff">
                      |
                    </text>
                    <text x={mid} y={lineY + 24} textAnchor="middle" fontSize="14" fontWeight="800" fontFamily={MONO} fill="var(--fc-banner-text)">
                      {idx < 2 ? 'Value' : 'Name'}
                    </text>
                  </g>
                )}

                <g
                  onClick={() => onSelectStage(idx)}
                  className="cursor-pointer fc-node"
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Inspect stage ${stage.stepNumber}, ${stage.kind}: ${stage.label}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStage(idx);
                    }
                  }}
                >
                  <rect x={x} y={y} width={width} height={height} rx="24" fill={colors.fill} stroke={colors.stroke} strokeWidth={isSelected ? '3.25' : '1.75'} filter="url(#clayNodeShadow)" />
                  <rect x={x + 14} y={y + 14} width="74" height="24" rx="12" fill={colors.badgeFill} />
                  <text x={x + 51} y={y + 31} textAnchor="middle" fontSize="14" fontWeight="800" fontFamily={MONO} fill={colors.badgeText}>
                    STEP {stage.stepNumber}
                  </text>
                  <text x={x + 14} y={y + 66} fontSize="15.5" fontWeight="700" fontFamily={SANS} fill={colors.titleFill}>
                    {fit(stage.label, innerChars(8.6, 24))}
                  </text>
                  <text x={x + 14} y={y + 87} fontSize="14" fontWeight="600" fontFamily={SANS} fill={colors.subFill}>
                    {fit(stage.sublabel, innerChars(7.4, 24))}
                  </text>
                  <rect x={x + 12} y={y + 98} width={width - 24} height="36" rx="11" fill="var(--fc-cmd-fill)" stroke="var(--fc-cmd-stroke)" strokeWidth="1" />
                  <text x={x + 20} y={y + 122} fontSize="14" fontWeight="700" fontFamily={MONO} fill="var(--fc-cmd-text)">
                    {fit(stage.commandOrMechanism, innerChars(8.4, 40))}
                  </text>
                  <text x={x + 14} y={y + 157} fontSize="14" fontWeight="700" fontFamily={MONO} fill={colors.subFill}>
                    {fit(`Out: ${stage.outputType}`, innerChars(8.4, 24))}
                  </text>
                </g>
              </g>
            );
          })}

          <rect x="18" y="228" width="924" height="10" rx="5" fill="var(--fc-track)" />
          <rect x="18" y="228" width={Math.round(((selectedStageIdx + 1) / count) * 924)} height="10" rx="5" fill="var(--fc-line-on)" />
        </svg>
      </div>
    </div>
  );
};
