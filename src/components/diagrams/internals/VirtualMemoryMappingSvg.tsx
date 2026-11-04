import React from 'react';

const VIRTUAL_PAGES = [
  { y: 48, ty: 64, f: '#2563eb', txt: 'Virtual Page 0 (4 KB)' },
  { y: 78, ty: 94, f: '#2563eb', txt: 'Virtual Page 1 (4 KB)' },
  { y: 108, ty: 124, f: '#64748b', txt: 'Virtual Page 2 (Paged)' },
];

const PHYSICAL_FRAMES = [
  { y: 48, h: 24, ty: 64, f: '#7c3aed', txt: 'RAM Frame #14 (4 KB)' },
  { y: 100, h: 24, ty: 116, f: '#7c3aed', txt: 'RAM Frame #89 (4 KB)' },
  { y: 128, h: 18, ty: 140, f: '#d97706', txt: 'Disk: pagefile.sys' },
];

export const VirtualMemoryMappingSvg: React.FC = () => {
  return (
    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
      <svg
        viewBox="0 0 640 165"
        className="w-full h-auto"
        role="img"
        aria-label="Virtual to Physical Page Mapping"
      >
        <rect
          x="15"
          y="15"
          width="175"
          height="135"
          rx="8"
          fill="#2563eb"
          fillOpacity="0.1"
          stroke="#2563eb"
          strokeWidth="2"
        />
        <text x="102" y="36" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="bold">
          Process Virtual Space
        </text>
        {VIRTUAL_PAGES.map((b) => (
          <g key={b.y}>
            <rect x="35" y={b.y} width="135" height="24" rx="4" fill={b.f} />
            <text x="102" y={b.ty} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
              {b.txt}
            </text>
          </g>
        ))}
        <text x="315" y="65" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">
          Memory Manager
        </text>
        <text x="315" y="82" textAnchor="middle" fill="#64748b" fontSize="10">
          Translates Page Tables
        </text>
        <line x1="170" y1="60" x2="450" y2="60" stroke="#10b981" strokeWidth="2" />
        <line x1="170" y1="90" x2="450" y2="115" stroke="#10b981" strokeWidth="2" />
        <line
          x1="170"
          y1="120"
          x2="450"
          y2="138"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="5,4"
        />
        <rect
          x="450"
          y="15"
          width="175"
          height="135"
          rx="8"
          fill="#7c3aed"
          fillOpacity="0.1"
          stroke="#7c3aed"
          strokeWidth="2"
        />
        <text x="537" y="36" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="bold">
          Physical RAM &amp; Disk
        </text>
        {PHYSICAL_FRAMES.map((b) => (
          <g key={b.y}>
            <rect x="470" y={b.y} width="135" height={b.h} rx="4" fill={b.f} />
            <text x="537" y={b.ty} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
              {b.txt}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
