import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  let currentFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : undefined;
  const desc = typeof window !== 'undefined' ? Object.getOwnPropertyDescriptor(window, 'fetch') : undefined;
  if (typeof window !== 'undefined' && (!desc || (desc.configurable !== false && !desc.set))) {
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get() {
        return currentFetch;
      },
      set(nextFetch) {
        if (typeof nextFetch === 'function') {
          currentFetch = nextFetch;
        }
      },
    });
  }
} catch {
  // Ignore if descriptor cannot be modified in restricted environment
}

createRoot(document.getElementById('root')!).render(<App />);

