import React from 'react';
import { ChevronLeft, ChevronRight, Cpu } from 'lucide-react';
import { FlowchartStageNode } from '../../../types';
import { PipelineSamplePacket } from '../../../utils/flowchartModels';

interface PipelineStageInspectorProps {
  activeStage: FlowchartStageNode;
  selectedStageIdx: number;
  totalStages: number;
  packetSnapshot: {
    bindingRule: string;
    stageStatusSummary: string;
    packets: PipelineSamplePacket[];
  };
  onPrevStage: () => void;
  onNextStage: () => void;
}

export const PipelineStageInspector: React.FC<PipelineStageInspectorProps> = ({
  activeStage,
  selectedStageIdx,
  totalStages,
  packetSnapshot,
  onPrevStage,
  onNextStage,
}) => {
  return (
    <div className="clay-card p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="guide-num-badge">
            Stage {activeStage.stepNumber} / {totalStages}
          </span>
          <h3 className="text-[1.125rem] font-bold">{activeStage.label}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={selectedStageIdx === 0}
            onClick={onPrevStage}
            className="clay-btn-secondary px-3.5 py-1.5 text-[0.75rem] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            disabled={selectedStageIdx === totalStages - 1}
            onClick={onNextStage}
            className="clay-btn-pink px-3.5 py-1.5 text-[0.75rem] text-[#383139] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-[1rem] leading-relaxed">{activeStage.plainEnglishSummary}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[0.75rem] font-mono">
        <div className="clay-cushion-cool p-3.5 rounded-[1.25rem]">
          <span className="opacity-75 block uppercase">Incoming Data</span>
          <span className="font-bold mt-0.5 block">{activeStage.inputType}</span>
        </div>
        <div className="clay-cushion-warm p-3.5 rounded-[1.25rem]">
          <span className="opacity-75 block uppercase">Command / Mechanism</span>
          <span className="font-bold mt-0.5 block truncate">{activeStage.commandOrMechanism}</span>
        </div>
        <div className="clay-cushion-mint p-3.5 rounded-[1.25rem]">
          <span className="opacity-75 block uppercase">Emitted Output</span>
          <span className="font-bold mt-0.5 block">{activeStage.outputType}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[0.75rem] font-mono">
          <span className="font-extrabold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Live .NET Objects Inside Stage {selectedStageIdx + 1}:</span>
          </span>
          <span className="opacity-80">{packetSnapshot.stageStatusSummary}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {packetSnapshot.packets.map((pkt) => {
            const isDroppedSoon = selectedStageIdx === 1 && !pkt.survivesFilter;
            return (
              <div
                key={pkt.id}
                className={`p-3 rounded-[1rem] text-[0.75rem] font-mono space-y-1 transition-all ${
                  isDroppedSoon ? 'clay-cushion-warm opacity-85' : 'clay-well'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{pkt.name}.exe</span>
                  <span className="px-2 py-0.5 rounded-full clay-pill text-[0.75rem]">PID {pkt.pid}</span>
                </div>
                <div className="opacity-80 text-[0.75rem]">
                  {selectedStageIdx >= 2
                    ? pkt.projectedOutput
                    : `WorkingSet: ${pkt.workingSetMB} MB · CPU: ${pkt.cpuSeconds}s`}
                </div>
                {isDroppedSoon && (
                  <span className="text-[0.75rem] font-extrabold block text-amber-900 dark:text-amber-300">
                    Filtered out next (RAM &lt; 50 MB)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
