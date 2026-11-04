import React from 'react';
import type { ConceptDiagram as ConceptDiagramData } from '../../../types';
import { LayerStackDiagram } from './LayerStackDiagram';
import { SequenceDiagram } from './SequenceDiagram';
import { CompareDiagram } from './CompareDiagram';
import { TreeDiagram } from './TreeDiagram';

export const ConceptDiagram: React.FC<{ diagram: ConceptDiagramData }> = ({ diagram }) => {
  switch (diagram.kind) {
    case 'layers':
      return <LayerStackDiagram diagram={diagram} />;
    case 'sequence':
      return <SequenceDiagram diagram={diagram} />;
    case 'compare':
      return <CompareDiagram diagram={diagram} />;
    case 'tree':
      return <TreeDiagram diagram={diagram} />;
  }
};
