import React from 'react';
import { useAtlasPointer } from '../../theme/useAtlasPointer';

/** Fixed, non-interactive atmosphere behind the Atlas shell: a blueprint grid that wakes under the cursor. */
export const AtlasBackdrop: React.FC = () => {
  useAtlasPointer();

  return (
    <>
      <div className="atlas-backdrop" aria-hidden="true">
        <div className="atlas-glow" />
        <div className="atlas-grid" />
        <div className="atlas-grid-hot" />
      </div>
      <div className="atlas-scroll-line" aria-hidden="true" />
    </>
  );
};
