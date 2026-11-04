import React, { useState, useEffect, useMemo } from 'react';
import { lessons } from '../data/lessons';
import { chapters } from '../data/chapters';
import { buildLessonFlowchartData, extractPlainEnglishKeyTerms } from '../utils/lessonPedagogy';
import {
  getCompletedLessons, toggleLessonCompleted,
  markLessonCompleted, saveLastVisitedLesson,
} from '../utils/progress';
import { LessonSidebar } from '../components/lesson/LessonSidebar';
import { LessonHeaderHero } from '../components/lesson/LessonHeaderHero';
import { LessonContent } from '../components/lesson/LessonContent';
import { LessonStartHere } from '../components/lesson/LessonGuideSections';
import { LessonCommandLadder } from '../components/lesson/LessonCommandLadder';
import { LessonCodeAndTrapsSection } from '../components/lesson/LessonCodeAndTrapsSection';
import { LessonPracticeAndQuizSection } from '../components/lesson/LessonPracticeAndQuizSection';
import { LessonFooterNav } from '../components/lesson/LessonFooterNav';
import { LessonTeacherIntro } from '../components/lesson/LessonTeacherIntro';
import { LessonTeacherPractice } from '../components/lesson/LessonTeacherPractice';
import { getLessonTeaching } from '../data/teaching';
import { DepthNotice } from '../components/lesson/DepthNotice';
import { estimateLessonTime } from '../utils/lessonTime';

interface LessonViewProps {
  chapterId: string;
  lessonSlug: string;
  onNavigate: (path: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ chapterId, lessonSlug, onNavigate }) => {
  // Strict match: the lesson must belong to the chapter in the URL (slug or id accepted).
  const currentLesson = lessons.find(
    (l) => l.chapterId === chapterId && (l.slug === lessonSlug || l.id === lessonSlug)
  );

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isLessonDone, setIsLessonDone] = useState<boolean>(false);

  useEffect(() => {
    setSelectedAnswers({});
    setCompletedTasks({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentLesson) {
      setIsLessonDone(getCompletedLessons().includes(currentLesson.id));
      saveLastVisitedLesson({
        chapterId: currentLesson.chapterId,
        lessonSlug: currentLesson.slug,
        lessonTitle: currentLesson.title,
        lessonNumber: currentLesson.id,
      });
    }
  }, [chapterId, lessonSlug, currentLesson]);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parentChapter = useMemo(
    () => (currentLesson ? chapters.find((c) => c.id === currentLesson.chapterId) : undefined),
    [currentLesson]
  );

  const flowchartData = useMemo(
    () => (currentLesson ? buildLessonFlowchartData(currentLesson, parentChapter) : null),
    [currentLesson, parentChapter]
  );

  const plainEnglishTerms = useMemo(
    () => (currentLesson ? extractPlainEnglishKeyTerms(currentLesson) : []),
    [currentLesson]
  );

  const totalQuizCount = currentLesson?.knowledgeCheck?.length || 0;
  const correctQuizCount = (currentLesson?.knowledgeCheck || []).filter(
    (q, idx) => selectedAnswers[idx] === q.correctIndex
  ).length;

  useEffect(() => {
    if (currentLesson && totalQuizCount > 0 && correctQuizCount === totalQuizCount) {
      markLessonCompleted(currentLesson.id);
      setIsLessonDone(true);
    }
  }, [totalQuizCount, correctQuizCount, currentLesson]);

  if (!currentLesson) {
    return (
      <div className="max-w-[58rem] mx-auto px-4 py-16 text-center space-y-4">
        <div className="clay-tray p-10 space-y-4">
          <h2 className="text-[1.75rem] font-bold">Lesson not found</h2>
          <p className="text-[1rem] opacity-85">Could not locate the lesson &ldquo;{lessonSlug}&rdquo;.</p>
          <button
            type="button"
            onClick={() => onNavigate(`/learn/${chapterId}`)}
            className="clay-btn-primary px-6 py-2.5 text-[0.875rem] cursor-pointer"
          >
            Return to Module
          </button>
        </div>
      </div>
    );
  }

  const lessonIndex = lessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;
  const teaching = getLessonTeaching(currentLesson.id);
  const time = estimateLessonTime(currentLesson, teaching);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className="max-w-[58rem] mx-auto px-3 sm:px-6 py-6 space-y-8">

      <LessonSidebar currentLesson={currentLesson} parentChapter={parentChapter} onNavigate={onNavigate} onScrollToSection={scrollToSection} hasTeaching={!!teaching} progress={scrollProgress} time={time} />
      <LessonHeaderHero currentLesson={currentLesson} parentChapter={parentChapter} plainEnglishTerms={plainEnglishTerms} time={time} />
      {currentLesson.guide && <LessonStartHere guide={currentLesson.guide} />}
      {teaching && <LessonTeacherIntro key={`intro-${currentLesson.id}`} teaching={teaching} lessonId={currentLesson.id} />}
      <LessonContent currentLesson={currentLesson} parentChapter={parentChapter} flowchartData={flowchartData} />
      <DepthNotice time={time} />
      {currentLesson.guide && <LessonCommandLadder guide={currentLesson.guide} />}
      <LessonCodeAndTrapsSection currentLesson={currentLesson} />
      {teaching && <LessonTeacherPractice key={`studio-${currentLesson.id}`} lessonId={currentLesson.id} teaching={teaching} />}

      <LessonPracticeAndQuizSection
        currentLesson={currentLesson}
        completedTasks={completedTasks}
        onToggleTask={(idx) => setCompletedTasks((prev) => ({ ...prev, [idx]: !prev[idx] }))}
        selectedAnswers={selectedAnswers}
        onSelectAnswer={(qIndex, optIdx) => setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIdx }))}
      />

      <LessonFooterNav
        currentLesson={currentLesson}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        isLessonDone={isLessonDone}
        onToggleLessonCompleted={() => {
          const updated = toggleLessonCompleted(currentLesson.id);
          setIsLessonDone(updated.includes(currentLesson.id));
        }}
        onNavigate={onNavigate}
      />
    </article>
  );
};
