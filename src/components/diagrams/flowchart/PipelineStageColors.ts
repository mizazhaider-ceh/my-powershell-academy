import { FlowchartStageNode } from '../../../types';

export interface StageColorScheme {
  fill: string;
  stroke: string;
  titleFill: string;
  subFill: string;
  badgeFill: string;
  badgeText: string;
}

const KIND_FILL: Partial<Record<FlowchartStageNode['kind'], string>> = {
  source: 'var(--fc-fill-source)',
  security: 'var(--fc-fill-security)',
  output: 'var(--fc-fill-output)',
};

/** Colours are CSS variables so the SVG follows light and dark mode (see theme/shared/flowchart.css). */
export function getStageColors(
  kind: FlowchartStageNode['kind'],
  isSelected: boolean
): StageColorScheme {
  if (isSelected) {
    return {
      fill: 'var(--fc-fill-selected)',
      stroke: 'var(--fc-stroke-selected)',
      titleFill: 'var(--fc-title)',
      subFill: 'var(--fc-sub-selected)',
      badgeFill: 'var(--fc-badge-selected)',
      badgeText: '#ffffff',
    };
  }
  return {
    fill: KIND_FILL[kind] ?? 'var(--fc-fill-default)',
    stroke: 'var(--fc-stroke)',
    titleFill: 'var(--fc-title)',
    subFill: 'var(--fc-sub)',
    badgeFill: 'var(--fc-badge-fill)',
    badgeText: 'var(--fc-badge-text)',
  };
}
