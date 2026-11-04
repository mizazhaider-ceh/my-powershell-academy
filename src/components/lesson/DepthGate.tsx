import React from 'react';
import { useLessonDepth, LessonDepth } from '../../utils/lessonDepth';

interface DepthGateProps {
  /** The depth at which the children are shown. 'full' children are hidden on the core path. */
  when: LessonDepth;
  children: React.ReactNode;
}

export const DepthGate: React.FC<DepthGateProps> = ({ when, children }) => {
  const depth = useLessonDepth();
  return depth === 'full' || when === 'core' ? <>{children}</> : null;
};
