import React from 'react';
import { Sparkles, ShieldAlert } from 'lucide-react';
import {
  Chapter,
  InteractiveWidgetId,
  Lesson as LessonType,
  LessonFlowchartData,
} from '../../types';
import { InteractivePipelineProcessFlowchart } from '../diagrams/InteractivePipelineProcessFlowchart';
import { PipelineVisualizer } from '../diagrams/PipelineVisualizer';
import { ObjectAnatomy } from '../diagrams/ObjectAnatomy';
import {
  SyscallAnimator,
  MalwareProcessHunter,
  VirtualMemoryPager,
  MbrByteInspector,
} from '../diagrams/WindowsInternalsWidgets';
import {
  SystemProcessesStepper,
  CmdletAnatomySvg,
  CoreNetworkSvg,
  OffensiveKillchainSvg,
} from '../diagrams/ArchitectureSvgDiagrams';
import { formatInlineRichText, getCalloutStyles } from './formatInlineRichText';

interface LessonContentProps {
  currentLesson: LessonType;
  parentChapter?: Chapter;
  flowchartData: LessonFlowchartData | null;
}

const renderInteractiveWidget = (widgetId?: InteractiveWidgetId) => {
  if (!widgetId) return null;
  switch (widgetId) {
    case 'pipeline-visualizer':
      return <PipelineVisualizer />;
    case 'object-anatomy':
      return <ObjectAnatomy />;
    case 'syscall-animator':
      return <SyscallAnimator />;
    case 'malware-process-hunter':
      return <MalwareProcessHunter />;
    case 'virtual-memory-pager':
      return <VirtualMemoryPager />;
    case 'mbr-byte-inspector':
      return <MbrByteInspector />;
    case 'system-processes-stepper':
      return <SystemProcessesStepper />;
    case 'cmdlet-anatomy-svg':
      return <CmdletAnatomySvg />;
    case 'core-network-svg':
      return <CoreNetworkSvg />;
    case 'offensive-killchain-svg':
      return <OffensiveKillchainSvg />;
    default:
      return null;
  }
};

export const LessonContent: React.FC<LessonContentProps> = ({
  currentLesson,
  parentChapter,
  flowchartData,
}) => {
  return (
    <>
      {flowchartData && (
        <section
          id="sec-flowchart"
          aria-label="Interactive SVG Pipeline, Process Tree, and Object Data Structure Flowchart"
          className="space-y-6"
        >
          <InteractivePipelineProcessFlowchart
            data={flowchartData}
            lesson={currentLesson}
            chapter={parentChapter}
          />

          {currentLesson.diagramId && (
            <div className="clay-tray p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 font-mono text-[0.75rem] font-bold uppercase tracking-wider opacity-80">
                <Sparkles className="w-4 h-4" />
                <span>Interactive Hands-On Simulator</span>
              </div>
              {renderInteractiveWidget(currentLesson.diagramId)}
            </div>
          )}

          {currentLesson.secondaryDiagramId && (
            <div className="clay-tray p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 font-mono text-[0.75rem] font-bold uppercase tracking-wider opacity-80">
                <ShieldAlert className="w-4 h-4" />
                <span>Interactive Security &amp; Forensic Lab</span>
              </div>
              {renderInteractiveWidget(currentLesson.secondaryDiagramId)}
            </div>
          )}
        </section>
      )}

      <section
        id="sec-concepts"
        aria-label="Step-by-step concept explanations"
        className="clay-tray p-6 sm:p-10 lg:p-12 space-y-10 lesson-prose"
      >
        <div className="pb-4 border-b border-black/10 dark:border-white/10 space-y-1">
          <span className="text-[0.75rem] font-mono font-bold uppercase tracking-wider opacity-75">
            Step-by-Step Deep Dive · Read Top to Bottom
          </span>
          <h2 className="text-[1.625rem] sm:text-[2rem] font-bold">
            Complete Concept Walkthrough
          </h2>
        </div>

        <div className="space-y-10">
          {currentLesson.conceptSections.map((sec, idx) => (
            <div
              key={idx}
              className={
                idx > 0
                  ? 'pt-8 border-t border-black/10 dark:border-white/10 space-y-4'
                  : 'space-y-4'
              }
            >
              <h3 className="text-[1.3125rem] sm:text-[1.5rem] font-bold flex items-center gap-3 leading-snug">
                <span className="guide-num-badge">3.{idx + 1}</span>
                <span>{sec.heading}</span>
              </h3>

              <div className="space-y-4 text-[1.0625rem] leading-[1.75] whitespace-pre-line">
                {sec.body.map((paragraph, pIdx) => (
                  <p key={pIdx}>{formatInlineRichText(paragraph)}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {currentLesson.calloutNotes &&
          currentLesson.calloutNotes.length > 0 && (
            <div className="pt-6 border-t border-black/10 dark:border-white/10 space-y-4">
              {currentLesson.calloutNotes.map((note, idx) => {
                const style = getCalloutStyles(note.type);
                return (
                  <div key={idx} className={`${style.cushion} p-6 space-y-2`}>
                    <span className="text-[0.8125rem] font-mono font-extrabold uppercase tracking-wider block">
                      {style.badge} · {note.title}
                    </span>
                    <p className="text-[1rem] leading-relaxed">
                      {formatInlineRichText(note.body)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
      </section>
    </>
  );
};
