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
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Interactive PowerShell Practice Labs"
        >
          {LAB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-full text-[0.8125rem] font-extrabold inline-flex items-center gap-2 cursor-pointer transition-all ${
                  isSelected ? 'clay-btn-primary' : 'clay-btn-secondary'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
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
