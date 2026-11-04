import React from 'react';
import { LastVisitedLesson } from '../../utils/progress';
import { Hero } from './Hero';
import { HeroTrackCushions } from './HeroTrackCushions';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
  completedCount: number;
  lastLesson: LastVisitedLesson | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  completedCount,
  lastLesson,
}) => {
  return (
    <section aria-label="Introduction">
      <Hero
        onNavigate={onNavigate}
        completedCount={completedCount}
        lastLesson={lastLesson}
      />
      <HeroTrackCushions onNavigate={onNavigate} />
    </section>
  );
};
