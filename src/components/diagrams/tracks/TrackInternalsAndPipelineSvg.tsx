import React from 'react';

export const TrackWindowsInternalsSvg: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1d4ed8] p-3.5 shadow-inner ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 360 165"
      className="w-full h-auto block"
      role="img"
      aria-label="Windows Internals 3D kernel and memory architecture illustration"
    >
      <defs>
        <linearGradient id="wi-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="wi-bot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="wi-core" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="180" cy="82" r="68" fill="#60a5fa" fillOpacity="0.18" />
      <circle cx="80" cy="40" r="36" fill="#34d399" fillOpacity="0.14" />
      <g stroke="rgba(147,197,253,0.16)" strokeWidth="1">
        <line x1="30" y1="142" x2="330" y2="142" />
        <line x1="65" y1="22" x2="65" y2="148" strokeDasharray="3 3" />
        <line x1="295" y1="22" x2="295" y2="148" strokeDasharray="3 3" />
      </g>
      <polygon
        points="180,88 296,118 180,148 64,118"
        fill="url(#wi-bot)"
        stroke="#93c5fd"
        strokeWidth="1.5"
      />
      <polygon
        points="64,118 180,148 180,156 64,126"
        fill="#172554"
        opacity="0.85"
      />
      <polygon
        points="296,118 180,148 180,156 296,126"
        fill="#0f172a"
        opacity="0.9"
      />
      <g stroke="#fde68a" strokeWidth="2.5" strokeDasharray="4 3">
        <line x1="126" y1="58" x2="126" y2="112" />
        <line x1="180" y1="64" x2="180" y2="118" />
        <line x1="234" y1="58" x2="234" y2="112" />
      </g>
      <polygon
        points="180,18 282,44 180,72 78,44"
        fill="url(#wi-top)"
        stroke="#eff6ff"
        strokeWidth="1.5"
      />
      <polygon
        points="180,62 208,78 180,94 152,78"
        fill="url(#wi-core)"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <circle cx="180" cy="78" r="6" fill="#ffffff" />
      <rect
        x="42"
        y="56"
        width="28"
        height="28"
        rx="8"
        fill="#34d399"
        fillOpacity="0.85"
        stroke="#ffffff"
        strokeWidth="1.2"
      />
      <rect
        x="290"
        y="56"
        width="28"
        height="28"
        rx="8"
        fill="#60a5fa"
        fillOpacity="0.85"
        stroke="#ffffff"
        strokeWidth="1.2"
      />
    </svg>
  </div>
);

export const TrackObjectPipelineSvg: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] p-3.5 shadow-inner ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 360 165"
      className="w-full h-auto block"
      role="img"
      aria-label="Advanced Object Pipeline 3D flow illustration"
    >
      <defs>
        <linearGradient id="op-node1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
        <linearGradient id="op-node2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="op-node3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <circle cx="180" cy="82" r="70" fill="#93c5fd" fillOpacity="0.18" />
      <rect
        x="28"
        y="70"
        width="304"
        height="24"
        rx="12"
        fill="rgba(15,23,42,0.45)"
        stroke="rgba(191,219,254,0.4)"
        strokeWidth="1.5"
      />
      <line
        x1="108"
        y1="82"
        x2="142"
        y2="82"
        stroke="#fde68a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="218"
        y1="82"
        x2="252"
        y2="82"
        stroke="#34d399"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g transform="translate(34, 42)">
        <rect
          width="76"
          height="78"
          rx="20"
          fill="url(#op-node1)"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <circle cx="26" cy="28" r="8" fill="#2563eb" />
        <circle cx="50" cy="28" r="8" fill="#60a5fa" />
        <rect x="18" y="46" width="40" height="14" rx="7" fill="#1d4ed8" />
      </g>
      <g transform="translate(142, 42)">
        <rect
          width="76"
          height="78"
          rx="20"
          fill="url(#op-node2)"
          stroke="#fef3c7"
          strokeWidth="2"
        />
        <polygon
          points="20,22 56,22 44,42 44,60 32,60 32,42"
          fill="#0f172a"
        />
      </g>
      <g transform="translate(250, 42)">
        <rect
          width="76"
          height="78"
          rx="20"
          fill="url(#op-node3)"
          stroke="#ecfdf5"
          strokeWidth="2"
        />
        <polygon points="38,18 58,38 38,58 18,38" fill="#064e3b" />
        <circle cx="38" cy="38" r="7" fill="#a7f3d0" />
      </g>
    </svg>
  </div>
);
