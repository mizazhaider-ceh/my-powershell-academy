import React, { useEffect, useState } from 'react';
import { getCompletedLessons, getLastVisitedLesson, LastVisitedLesson } from '../utils/progress';
import { AtlasHero } from '../components/atlas/home/AtlasHero';
import { AtlasContents } from '../components/atlas/home/AtlasContents';
import { AtlasClosing } from '../components/atlas/home/AtlasClosing';
import { HomeStatsStrip } from '../components/home/HomeStatsStrip';
import { LearningLoopSection } from '../components/home/LearningLoopSection';
import { CmdletMarquee } from '../components/home/CmdletMarquee';
import { LabsShowcase } from '../components/home/LabsShowcase';
import { useHomeStats } from '../components/home/useHomeStats';

interface AtlasHomeViewProps {
  onNavigate: (path: string) => void;
}

/** The Atlas home page: an editorial scroll with a live pipeline hero and a table-of-contents curriculum. */
export const AtlasHomeView: React.FC<AtlasHomeViewProps> = ({ onNavigate }) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [lastLesson, setLastLesson] = useState<LastVisitedLesson | null>(null);
  const stats = useHomeStats();

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
    <div className="max-w-[76rem] mx-auto space-y-24">
      <AtlasHero onNavigate={onNavigate} />
      <HomeStatsStrip stats={stats} />
      <LearningLoopSection />
      <AtlasContents onNavigate={onNavigate} completedIds={completedIds} />
      <CmdletMarquee onNavigate={onNavigate} />
      <LabsShowcase onNavigate={onNavigate} />
      <AtlasClosing onNavigate={onNavigate} lastLesson={lastLesson} completedCount={completedIds.length} />
    </div>
  );
};
