import React from 'react';
import type { CompareDiagram as CompareDiagramData } from '../../../types';
import { DiagramFrame, toneClass } from './DiagramFrame';

/** Two approaches in aligned rows, so differences line up and can be read across. */
export const CompareDiagram: React.FC<{ diagram: CompareDiagramData }> = ({ diagram }) => {
  const { left, right } = diagram;
  const rows = Math.max(left.rows.length, right.rows.length);

  return (
    <DiagramFrame title={diagram.title} caption={diagram.caption}>
      <div className="cd-compare">
        <div className={`cd-col-head ${toneClass(left.tone)}`}>{left.heading}</div>
        <div className="cd-vs" aria-hidden="true">vs</div>
        <div className={`cd-col-head ${toneClass(right.tone)}`}>{right.heading}</div>

        {Array.from({ length: rows }, (_, i) => (
          <React.Fragment key={i}>
            <div className={`cd-cell ${toneClass(left.tone)}`} style={{ '--i': i } as React.CSSProperties}>
              {left.rows[i] && (
                <>
                  <b>{left.rows[i].label}</b>
                  {left.rows[i].value}
                </>
              )}
            </div>
            <div className="cd-vs" aria-hidden="true" />
            <div className={`cd-cell ${toneClass(right.tone)}`} style={{ '--i': i } as React.CSSProperties}>
              {right.rows[i] && (
                <>
                  <b>{right.rows[i].label}</b>
                  {right.rows[i].value}
                </>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="clay-well px-4 py-3 text-[0.9rem] leading-relaxed">
        <span className="font-semibold">The takeaway: </span>
        {diagram.verdict}
      </div>
    </DiagramFrame>
  );
};
