import React, { useState } from 'react';
import type { TreeDiagram as TreeDiagramData, TreeDiagramNode } from '../../../types';
import { DiagramFrame, toneClass } from './DiagramFrame';

interface NodeProps {
  node: TreeDiagramNode;
  id: string;
  selectedId: string;
  onSelect: (id: string, node: TreeDiagramNode) => void;
}

const Node: React.FC<NodeProps> = ({ node, id, selectedId, onSelect }) => (
  <li>
    <button
      type="button"
      className={`cd-node ${toneClass(node.tone)}`}
      data-selected={selectedId === id}
      onClick={() => onSelect(id, node)}
    >
      <span className="font-semibold">{node.label}</span>
      {node.sub && <small>{node.sub}</small>}
    </button>
    {node.children && node.children.length > 0 && (
      <ul>
        {node.children.map((child, i) => (
          <Node key={`${id}.${i}`} node={child} id={`${id}.${i}`} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </ul>
    )}
  </li>
);

/** A hierarchy you can click through. The selected node explains itself on the right. */
export const TreeDiagram: React.FC<{ diagram: TreeDiagramData }> = ({ diagram }) => {
  const [selection, setSelection] = useState<{ id: string; node: TreeDiagramNode }>({ id: '0', node: diagram.root });

  return (
    <DiagramFrame title={diagram.title} caption={diagram.caption}>
      <div className="cd-tree-wrap">
        <ul className="cd-tree">
          <Node node={diagram.root} id="0" selectedId={selection.id} onSelect={(id, node) => setSelection({ id, node })} />
        </ul>
        <div key={selection.id} className={`cd-detail ${toneClass(selection.node.tone)}`} aria-live="polite">
          <div className="font-semibold text-[1rem]">{selection.node.label}</div>
          {selection.node.sub && <div className="mb-2 text-[0.78rem] opacity-70">{selection.node.sub}</div>}
          <p>{selection.node.detail}</p>
        </div>
      </div>
    </DiagramFrame>
  );
};
