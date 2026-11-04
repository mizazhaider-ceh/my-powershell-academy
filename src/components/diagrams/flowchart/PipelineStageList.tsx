import React from 'react';
import { FlowchartStageNode } from '../../../types';

interface PipelineStageListProps {
  stages: FlowchartStageNode[];
  selectedStageIdx: number;
  onSelectStage: (idx: number) => void;
}

/** Narrow-screen version of the pipeline diagram: one readable card per stage. */
export const PipelineStageList: React.FC<PipelineStageListProps> = ({ stages, selectedStageIdx, onSelectStage }) => (
  <ol className="fc-list" aria-label="Pipeline stages">
    {stages.map((stage, idx) => (
      <li key={stage.id} className="fc-item">
        <button
          type="button"
          className="fc-card"
          data-kind={stage.kind}
          data-selected={idx === selectedStageIdx}
          aria-current={idx === selectedStageIdx ? 'step' : undefined}
          onClick={() => onSelectStage(idx)}
        >
          <span className="fc-step">STEP {stage.stepNumber} · {stage.kind.toUpperCase()}</span>
          <b>{stage.label}</b>
          <small>{stage.sublabel}</small>
          <code>{stage.commandOrMechanism}</code>
          <small>Out: {stage.outputType}</small>
        </button>
        {idx < stages.length - 1 && (
          <p className="fc-item-link" aria-hidden="true">
            | {idx < 2 ? 'ByValue' : 'ByPropertyName'}
          </p>
        )}
      </li>
    ))}
  </ol>
);
