import React from 'react';
import { ProcessTreeNode } from '../../../utils/flowchartModels';

interface ProcessTreeListProps {
  processNodes: ProcessTreeNode[];
  activeProcessId: string;
  lineageSet: Set<string>;
  onSelectProcess: (id: string) => void;
}

function orderByHierarchy(nodes: ProcessTreeNode[]): { node: ProcessTreeNode; depth: number }[] {
  const out: { node: ProcessTreeNode; depth: number }[] = [];
  const visit = (parentId: string | null, depth: number) => {
    nodes
      .filter((n) => n.parentId === parentId)
      .forEach((node) => {
        out.push({ node, depth });
        visit(node.id, depth + 1);
      });
  };
  visit(null, 0);
  return out;
}

/** Narrow-screen version of the process tree: an indented list that keeps parent and child order. */
export const ProcessTreeList: React.FC<ProcessTreeListProps> = ({ processNodes, activeProcessId, lineageSet, onSelectProcess }) => (
  <ul className="fc-tree" aria-label="Windows process tree, children indented under their parent">
    {orderByHierarchy(processNodes).map(({ node, depth }) => (
      <li key={node.id} className="fc-tree-item" style={{ '--depth': Math.min(depth, 4) } as React.CSSProperties}>
        <button
          type="button"
          className="fc-card"
          data-selected={node.id === activeProcessId}
          data-lineage={lineageSet.has(node.id) || undefined}
          data-bad={node.isSuspicious || undefined}
          aria-pressed={node.id === activeProcessId}
          onClick={() => onSelectProcess(node.id)}
        >
          <b>{node.name}</b>
          <span className="fc-meta">
            PID {node.pid} · PPID {node.ppid} · {node.ring} · Session {node.sessionId} · {node.workingSetMB} MB
          </span>
        </button>
      </li>
    ))}
  </ul>
);
