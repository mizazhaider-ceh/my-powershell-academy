import React from 'react';
import { CalloutNote } from '../../types';

export const formatInlineRichText = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-bold">
          {formatInlineRichText(part.slice(2, -2))}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-2 py-0.5 rounded-[0.4375rem] bg-[#ded0f9]/60 dark:bg-white/10 font-mono text-[0.9em] font-bold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

export const getCalloutStyles = (type: CalloutNote['type']) => {
  switch (type) {
    case 'key':
      return { badge: '💡 Key Concept', cushion: 'clay-cushion-warm' };
    case 'try':
      return { badge: '🧪 Hands-On Check', cushion: 'clay-cushion-mint' };
    case 'gotcha':
      return {
        badge: '⚠️ Classic Beginner Trap',
        cushion: 'clay-cushion-lavender',
      };
    case 'danger':
      return {
        badge: '🚨 Security & Red/Blue Team Alert',
        cushion: 'clay-cushion-pink',
      };
    case 'pro':
    default:
      return { badge: '🎓 What to Know Cold', cushion: 'clay-cushion-cool' };
  }
};
