import React, { useRef } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
}

/** A button that leans toward a nearby fine pointer. Uses the independent `translate` property so hover transforms still compose. */
export const MagneticButton: React.FC<MagneticButtonProps> = ({ strength = 0.28, children, onPointerMove, onPointerLeave, ...rest }) => {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      {...rest}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const node = ref.current;
        if (!node || event.pointerType !== 'mouse') return;
        const rect = node.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        node.style.translate = `${dx * strength}px ${dy * strength}px`;
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (ref.current) ref.current.style.translate = '0px 0px';
      }}
      style={{ transition: 'translate 0.35s cubic-bezier(0.22, 1, 0.36, 1)', ...rest.style }}
    >
      {children}
    </button>
  );
};
