import React from 'react';

export const TrackFleetAutomationSvg: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#0f172a] via-[#1e40af] to-[#0284c7] p-3.5 shadow-inner ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 360 165"
      className="w-full h-auto block"
      role="img"
      aria-label="Systems and Fleet Automation 3D server cluster illustration"
    >
      <g stroke="#7dd3fc" strokeWidth="2.5" strokeDasharray="4 3">
        <line x1="112" y1="82" x2="218" y2="38" />
        <line x1="112" y1="82" x2="218" y2="82" />
        <line x1="112" y1="82" x2="218" y2="126" />
      </g>
      <g transform="translate(28, 36)">
        <rect
          width="88"
          height="92"
          rx="22"
          fill="#dbeafe"
          stroke="#ffffff"
          strokeWidth="2"
        />
        <circle cx="44" cy="46" r="24" fill="#1d4ed8" />
        <circle cx="44" cy="46" r="11" fill="#fde68a" />
        <circle cx="20" cy="20" r="4" fill="#3b82f6" />
        <circle cx="68" cy="20" r="4" fill="#3b82f6" />
      </g>
      {[
        { y: 20, fill: '#c0efdc', dot: '#10b981' },
        { y: 65, fill: '#f9e7a8', dot: '#f59e0b' },
        { y: 110, fill: '#e0e7ff', dot: '#2563eb' },
      ].map((srv, idx) => (
        <g key={idx} transform={`translate(216, ${srv.y})`}>
          <rect
            width="114"
            height="34"
            rx="12"
            fill={srv.fill}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <circle cx="20" cy="17" r="6" fill={srv.dot} />
          <rect
            x="36"
            y="11"
            width="44"
            height="5"
            rx="2.5"
            fill="#0f172a"
            fillOpacity="0.65"
          />
          <rect
            x="36"
            y="19"
            width="28"
            height="4"
            rx="2"
            fill="#0f172a"
            fillOpacity="0.35"
          />
          <circle cx="96" cy="17" r="4" fill="#0f172a" fillOpacity="0.3" />
        </g>
      ))}
    </svg>
  </div>
);

export const TrackEthicalHackersSvg: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#090d16] via-[#1e1b4b] to-[#1d4ed8] p-3.5 shadow-inner ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 360 165"
      className="w-full h-auto block"
      role="img"
      aria-label="Ethical Hacking Red Team radar and Blue Team shield illustration"
    >
      <circle cx="76" cy="82" r="45" fill="#f87171" fillOpacity="0.18" />
      <circle cx="284" cy="82" r="45" fill="#38bdf8" fillOpacity="0.2" />
      <line
        x1="116"
        y1="82"
        x2="142"
        y2="82"
        stroke="#f87171"
        strokeWidth="2.5"
        strokeDasharray="3 3"
      />
      <line
        x1="218"
        y1="82"
        x2="244"
        y2="82"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeDasharray="3 3"
      />
      <g transform="translate(26, 36)">
        <rect
          width="90"
          height="92"
          rx="20"
          fill="rgba(254,226,226,0.92)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        <circle
          cx="45"
          cy="46"
          r="26"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
        />
        <circle
          cx="45"
          cy="46"
          r="14"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <line
          x1="45"
          y1="46"
          x2="64"
          y2="29"
          stroke="#dc2626"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="45" cy="46" r="4" fill="#991b1b" />
        <circle cx="58" cy="34" r="3.5" fill="#ef4444" />
      </g>
      <path
        d="M180 20 L224 38 L224 84 C224 116 204 138 180 150 C156 138 136 116 136 84 L136 38 Z"
        fill="#1d4ed8"
        stroke="#93c5fd"
        strokeWidth="2"
      />
      <path
        d="M180 34 L210 47 L210 82 C210 105 196 122 180 132 C164 122 150 105 150 82 L150 47 Z"
        fill="#1e3a8a"
      />
      <path
        d="M168 82 L177 91 L195 71"
        fill="none"
        stroke="#fde68a"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="translate(244, 36)">
        <rect
          width="90"
          height="92"
          rx="20"
          fill="#dbeafe"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
        <circle
          cx="42"
          cy="42"
          r="18"
          fill="#93c5fd"
          fillOpacity="0.45"
          stroke="#1d4ed8"
          strokeWidth="3"
        />
        <line
          x1="55"
          y1="55"
          x2="68"
          y2="68"
          stroke="#1e3a8a"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <circle cx="42" cy="42" r="5" fill="#1d4ed8" />
      </g>
    </svg>
  </div>
);
