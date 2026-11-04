import { FlowchartStageNode } from '../../../types';

export interface StageColorScheme {
  fill: string;
  stroke: string;
  titleFill: string;
  subFill: string;
  badgeFill: string;
  badgeText: string;
}

export function getStageColors(
  kind: FlowchartStageNode['kind'],
  isSelected: boolean
): StageColorScheme {
  if (isSelected) {
    return {
      fill: '#bfdbfe',
      stroke: '#1d4ed8',
      titleFill: '#0f172a',
      subFill: '#1e3a8a',
      badgeFill: '#1d4ed8',
      badgeText: '#ffffff',
    };
  }
  switch (kind) {
    case 'source':
      return {
        fill: '#c5e5fb',
        stroke: '#0f172a',
        titleFill: '#0f172a',
        subFill: '#334155',
        badgeFill: '#ffffff',
        badgeText: '#0f172a',
      };
    case 'security':
      return {
        fill: '#f9e7a8',
        stroke: '#0f172a',
        titleFill: '#0f172a',
        subFill: '#334155',
        badgeFill: '#ffffff',
        badgeText: '#0f172a',
      };
    case 'output':
      return {
        fill: '#c0efdc',
        stroke: '#0f172a',
        titleFill: '#0f172a',
        subFill: '#334155',
        badgeFill: '#ffffff',
        badgeText: '#0f172a',
      };
    default:
      return {
        fill: '#e0e7ff',
        stroke: '#0f172a',
        titleFill: '#0f172a',
        subFill: '#334155',
        badgeFill: '#ffffff',
        badgeText: '#0f172a',
      };
  }
}
