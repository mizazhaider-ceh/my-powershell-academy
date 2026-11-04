import { useEffect } from 'react';

/**
 * Atlas pointer tracking:
 * - --ptr-x/--ptr-y on <html> light up the blueprint grid under the cursor
 * - --mx/--my on hovered `clay-*` surfaces give each panel its own spotlight
 */
export function useAtlasPointer() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const root = document.documentElement;
    let frame = 0;
    let latest: PointerEvent | null = null;

    const paint = () => {
      frame = 0;
      const event = latest;
      if (!event) return;
      root.style.setProperty('--ptr-x', `${event.clientX}px`);
      root.style.setProperty('--ptr-y', `${event.clientY}px`);

      let node = event.target instanceof HTMLElement ? event.target : null;
      let depth = 0;
      while (node && depth < 8) {
        if (typeof node.className === 'string' && node.className.includes('clay-')) {
          const rect = node.getBoundingClientRect();
          node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
          node.style.setProperty('--my', `${event.clientY - rect.top}px`);
        }
        node = node.parentElement;
        depth += 1;
      }
    };

    const onMove = (event: PointerEvent) => {
      latest = event;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty('--ptr-x');
      root.style.removeProperty('--ptr-y');
    };
  }, []);
}
