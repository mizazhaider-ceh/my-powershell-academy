import React, { useState, useEffect } from 'react';
import { GitCommit, Network, Boxes, Sparkles, Play, Pause, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { LessonFlowchartData, FlowchartStageNode, Lesson, Chapter } from '../../types';
import {
  ProcessTreeScenario, ProcessTreeNode, getProcessTreeNodes,
  getProcessLineageIds, getPipelinePacketsForStage, getRecommendedFlowchartTab,
} from '../../utils/flowchartModels';
import { PipelineSvgCanvas } from './flowchart/PipelineSvgCanvas';
import { PipelineStageInspector } from './flowchart/PipelineStageInspector';
import { ProcessTreeSvgCanvas } from './flowchart/ProcessTreeSvgCanvas';
import { ProcessTreeNodeInspector } from './flowchart/ProcessTreeNodeInspector';
import { ObjectXRayPanel } from './flowchart/ObjectXRayPanel';

interface InteractivePipelineProcessFlowchartProps {
  data: LessonFlowchartData;
  lesson?: Lesson;
  chapter?: Chapter;
}

const FLOWCHART_TABS = [
  { id: 'pipeline' as const, label: 'Object Pipeline SVG', Icon: GitCommit },
  { id: 'processtree' as const, label: 'Process Tree SVG', Icon: Network },
  { id: 'object' as const, label: '.NET Object X-Ray', Icon: Boxes },
];

export const InteractivePipelineProcessFlowchart: React.FC<
  InteractivePipelineProcessFlowchartProps
> = ({ data, lesson, chapter }) => {
  const defaultTab = lesson ? getRecommendedFlowchartTab(lesson, chapter) : 'pipeline';
  const [activeMode, setActiveMode] = useState<'pipeline' | 'processtree' | 'object'>(defaultTab);
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [isAutoStepping, setIsAutoStepping] = useState<boolean>(false);
  const [selectedMemberIdx, setSelectedMemberIdx] = useState<number>(0);
  const [treeScenario, setTreeScenario] = useState<ProcessTreeScenario>('normal');
  const [selectedProcessId, setSelectedProcessId] = useState<string>('proc-pwsh');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  useEffect(() => {
    if (lesson) {
      setActiveMode(getRecommendedFlowchartTab(lesson, chapter));
      setSelectedStageIdx(0);
      setSelectedMemberIdx(0);
      setIsAutoStepping(false);
    }
  }, [lesson?.id, chapter?.id]);

  useEffect(() => {
    if (!isAutoStepping || activeMode !== 'pipeline') return;
    const timer = window.setInterval(() => {
      setSelectedStageIdx((prev) => (prev + 1) % data.stages.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isAutoStepping, activeMode, data.stages.length]);

  const stages = data.stages;
  const activeStage: FlowchartStageNode = stages[selectedStageIdx] || stages[0];
  const blueprint = data.objectBlueprint;
  const packetSnapshot = getPipelinePacketsForStage(selectedStageIdx);

  const processNodes = getProcessTreeNodes(treeScenario);
  const activeProcessNode: ProcessTreeNode =
    processNodes.find((n) => n.id === selectedProcessId) || processNodes[processNodes.length - 1];
  const activeLineageIds = getProcessLineageIds(processNodes, activeProcessNode.id);
  const lineageSet = new Set(activeLineageIds);

  const handleScenarioSwitch = (nextScenario: ProcessTreeScenario) => {
    setTreeScenario(nextScenario);
    setSelectedProcessId(nextScenario === 'anomaly' ? 'proc-rogue-ps' : 'proc-pwsh');
  };

  const handleCopyCommand = (cmd: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cmd).catch(() => {});
    }
    setCopiedCmd(true);
    window.setTimeout(() => setCopiedCmd(false), 1800);
  };

  return (
    <div className="clay-tray p-6 sm:p-10 space-y-6" data-testid="interactive-pipeline-process-flowchart">
      <div className="flex flex-col gap-4 pb-4 border-b border-black/10 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[0.75rem] font-mono font-bold uppercase tracking-wider opacity-80">
            <Sparkles className="w-4 h-4" />
            <span>Section 2 · Interactive SVG Architecture &amp; Flowchart Explorer</span>
          </div>
          <h2 className="text-[1.375rem] sm:text-[1.625rem] font-bold">
            {activeMode === 'pipeline'
              ? data.pipelineTitle
              : activeMode === 'processtree'
              ? 'Windows NT Process Tree & Parent-Child (PPID) Hierarchy'
              : blueprint.friendlyTitle}
          </h2>
          <p className="text-[0.9375rem] opacity-85">
            {activeMode === 'pipeline'
              ? data.pipelineSubtitle
              : activeMode === 'processtree'
              ? 'Click any process node in the SVG hierarchy to trace its parent chain from Ring 0 (System PID 4) to Ring 3 user space.'
              : blueprint.plainEnglishOverview}
          </p>
        </div>

        <div className="clay-well p-1.5 rounded-full flex flex-wrap items-center gap-1.5 self-start shrink-0" role="tablist" aria-label="Interactive SVG flowchart mode">
          {FLOWCHART_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={activeMode === id}
              onClick={() => setActiveMode(id)}
              className={`px-4 py-2 rounded-full text-[0.8125rem] font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap transition-all ${
                activeMode === id ? 'clay-btn-pink text-[#383139]' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeMode === 'pipeline' && (
        <div className="space-y-6" data-testid="pipeline-svg-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[0.75rem] font-mono">
              <span className="px-3 py-1 rounded-full clay-pill font-bold">Active Binding: {packetSnapshot.bindingRule}</span>
              <span className="px-3 py-1 rounded-full clay-pill font-bold">Objects in Stream: {packetSnapshot.packets.length}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAutoStepping((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-full text-[0.75rem] font-mono font-bold flex items-center gap-1.5 cursor-pointer ${
                isAutoStepping ? 'clay-cushion-mint' : 'clay-btn-secondary'
              }`}
            >
              {isAutoStepping ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoStepping ? 'Pause Stream' : 'Auto-Step Flow'}</span>
            </button>
          </div>
          <PipelineSvgCanvas pipelineTitle={data.pipelineTitle} stages={stages} selectedStageIdx={selectedStageIdx} onSelectStage={setSelectedStageIdx} />
          <PipelineStageInspector
            activeStage={activeStage}
            selectedStageIdx={selectedStageIdx}
            totalStages={stages.length}
            packetSnapshot={packetSnapshot}
            onPrevStage={() => { setIsAutoStepping(false); setSelectedStageIdx((i) => Math.max(0, i - 1)); }}
            onNextStage={() => { setIsAutoStepping(false); setSelectedStageIdx((i) => Math.min(stages.length - 1, i + 1)); }}
          />
        </div>
      )}

      {activeMode === 'processtree' && (
        <div className="space-y-6" data-testid="processtree-svg-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleScenarioSwitch('normal')}
                className={`px-4 py-2 rounded-full text-[0.8125rem] font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  treeScenario === 'normal' ? 'clay-cushion-mint' : 'clay-well opacity-80 hover:opacity-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Healthy Windows Process Tree</span>
              </button>
              <button
                type="button"
                onClick={() => handleScenarioSwitch('anomaly')}
                className={`px-4 py-2 rounded-full text-[0.8125rem] font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  treeScenario === 'anomaly' ? 'clay-cushion-warm' : 'clay-well opacity-80 hover:opacity-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>2. Threat Hunt: PPID &amp; Macro Anomalies</span>
              </button>
            </div>
            <div className="text-[0.75rem] font-mono font-bold px-3.5 py-1.5 rounded-full clay-pill">
              Active Lineage: {activeLineageIds.map((id) => processNodes.find((n) => n.id === id)?.name || id).join(' -> ')}
            </div>
          </div>
          <ProcessTreeSvgCanvas processNodes={processNodes} activeProcessId={activeProcessNode.id} lineageSet={lineageSet} onSelectProcess={setSelectedProcessId} />
          <ProcessTreeNodeInspector activeProcessNode={activeProcessNode} copiedCmd={copiedCmd} onCopyCommand={handleCopyCommand} />
        </div>
      )}

      {activeMode === 'object' && (
        <ObjectXRayPanel blueprint={blueprint} selectedMemberIdx={selectedMemberIdx} onSelectMember={setSelectedMemberIdx} />
      )}
    </div>
  );
};
