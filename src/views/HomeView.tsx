import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { PipelineWalkthroughSection } from '../components/home/PipelineWalkthroughSection';
import { CommandBuilderLab } from '../components/interactive/CommandBuilderLab';
import { ModuleGridSection } from '../components/home/ModuleGridSection';
import { PowerShellMasteryVault } from '../components/home/PowerShellMasteryVault';
import { ArchitectureComparisonSection } from '../components/home/ArchitectureComparisonSection';
import {
  getCompletedLessons,
  getLastVisitedLesson,
  LastVisitedLesson,
} from '../utils/progress';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [lastLesson, setLastLesson] = useState<LastVisitedLesson | null>(null);

  useEffect(() => {
    const sync = () => {
      setCompletedIds(getCompletedLessons());
      setLastLesson(getLastVisitedLesson());
    };
    sync();
    window.addEventListener('ps-progress-updated', sync);
    return () => window.removeEventListener('ps-progress-updated', sync);
  }, []);

  return (
    <div className="max-w-[76rem] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-8">
      {/* 1. Hero Section + Full-Width #1 Rule Banner + 4 Track Cushions */}
      <HeroSection
        onNavigate={onNavigate}
        completedCount={completedIds.length}
        lastLesson={lastLesson}
      />

      {/* 2. Shared Tray: Pipeline Stepper + Live Command Builder + 16 Illustrated Module Cards */}
      <section className="clay-tray p-6 sm:p-10 lg:p-12 space-y-12">
        <PipelineWalkthroughSection />
        <CommandBuilderLab />
        <ModuleGridSection
          onNavigate={onNavigate}
          completedIds={completedIds}
        />
      </section>

      {/* 3. Deep-Dive Engineering Vault: Automatic Variables, 5.1 vs 7.5 Matrix & Golden Laws */}
      <PowerShellMasteryVault onNavigate={onNavigate} />

      {/* 4. Architecture Comparisons, Classic Traps & Closing CTA */}
      <ArchitectureComparisonSection onNavigate={onNavigate} />
    </div>
  );
};
