import React, { useState } from 'react';
import {
  Bug,
  ShieldAlert,
  GitMerge,
  Server,
  Wand2,
  Zap,
} from 'lucide-react';
import { BugFixerLab } from './BugFixerLab';
import { Base64Event4104Lab } from './Base64Event4104Lab';
import { ParameterBindingLab } from './ParameterBindingLab';
import { ServerCoreBuilderLab } from './ServerCoreBuilderLab';
import { SplattingRefactorLab } from './SplattingRefactorLab';
import { FlashcardSpeedDrills } from './FlashcardSpeedDrills';
import { TabList, tabPanelProps } from '../common/TabList';

type LabTabId =
  | 'bugs'
  | 'base64'
  | 'binding'
  | 'servercore'
  | 'splatting'
  | 'flashcards';

const LAB_TABS: {
  id: LabTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'bugs', label: '1. Fix Broken Scripts', icon: Bug },
  { id: 'base64', label: '2. Base64 & Event 4104', icon: ShieldAlert },
  { id: 'binding', label: '3. Parameter Binding Tracer', icon: GitMerge },
  { id: 'servercore', label: '4. Server Core .ps1 Builder', icon: Server },
  { id: 'splatting', label: '5. @Splatting & ADSI LDAP', icon: Wand2 },
  { id: 'flashcards', label: '6. .NET OutputType Flashcards', icon: Zap },
];

export const PracticeLabsWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTabId>('bugs');

  return (
    <section className="clay-tray p-6 sm:p-10 space-y-6">
      <div className="space-y-3 border-b border-black/10 dark:border-white/10 pb-5">
        <span className="text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)] block">
          6 Interactive Hands-On Workbenches · Select a Lab Mode Below
        </span>
        <TabList
          idPrefix="practice-labs"
          label="Interactive PowerShell Practice Labs"
          className="flex flex-wrap gap-2"
          tabs={LAB_TABS.map((tab) => {
            const Icon = tab.icon;
            return {
              id: tab.id,
              label: (
                <>
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{tab.label}</span>
                </>
              ),
            };
          })}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as LabTabId)}
          tabClassName={(isSelected) =>
            `px-4 py-2.5 rounded-full text-[0.8125rem] font-extrabold inline-flex items-center gap-2 cursor-pointer transition-all ${
              isSelected ? 'clay-btn-primary' : 'clay-btn-secondary'
            }`
          }
        />
      </div>

      <div {...tabPanelProps('practice-labs', activeTab)}>
        {activeTab === 'bugs' && <BugFixerLab />}
        {activeTab === 'base64' && <Base64Event4104Lab />}
        {activeTab === 'binding' && <ParameterBindingLab />}
        {activeTab === 'servercore' && <ServerCoreBuilderLab />}
        {activeTab === 'splatting' && <SplattingRefactorLab />}
        {activeTab === 'flashcards' && <FlashcardSpeedDrills />}
      </div>
    </section>
  );
};
