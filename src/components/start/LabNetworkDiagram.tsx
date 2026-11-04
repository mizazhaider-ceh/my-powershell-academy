import React from 'react';
import { LAB_ENVIRONMENT } from '../../data/labEnvironment';

const HOSTS = LAB_ENVIRONMENT.hosts;

/** The lab network drawn from the single LAB_ENVIRONMENT source, so it can never disagree with the lessons. */
export const LabNetworkDiagram: React.FC = () => {
  const width = 720;
  const slot = width / HOSTS.length;
  return (
    <figure className="space-y-2">
      <svg
        viewBox={`0 0 ${width} 250`}
        className="w-full h-auto"
        role="img"
        aria-label={`Lab network ${LAB_ENVIRONMENT.subnet}. ${HOSTS.map((h) => `${h.name} at ${h.ip}`).join(', ')}.`}
      >
        <rect x="30" y="118" width={width - 60} height="14" rx="7" fill="var(--dp-color-accent)" opacity="0.9" />
        <text x={width / 2} y="150" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill="currentColor">
          {LAB_ENVIRONMENT.switchName} switch, {LAB_ENVIRONMENT.subnet}
        </text>
        {HOSTS.map((host, i) => {
          const cx = slot * i + slot / 2;
          const below = i === 1;
          const top = below ? 168 : 22;
          return (
            <g key={host.name}>
              <line x1={cx} x2={cx} y1={below ? 132 : 125} y2={below ? 168 : 90} stroke="var(--dp-color-accent)" strokeWidth="3" />
              <rect x={cx - 100} y={top} width="200" height="68" rx="12" fill="var(--dp-color-surface)" stroke="var(--dp-color-accent)" strokeWidth="2" />
              <text x={cx} y={top + 26} textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="var(--font-mono)" fill="currentColor">{host.name}</text>
              <text x={cx} y={top + 46} textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill="currentColor">{host.ip}</text>
              <text x={cx} y={top + 61} textAnchor="middle" fontSize="10.5" fill="currentColor" opacity="0.8">{host.ramGb} GB RAM, {host.diskGb} GB disk</text>
            </g>
          );
        })}
      </svg>
      <figcaption className="text-[0.85rem] opacity-80">
        Domain {LAB_ENVIRONMENT.domain} (NetBIOS {LAB_ENVIRONMENT.netbios}). DNS runs on DC01 at {LAB_ENVIRONMENT.dnsServer}.
      </figcaption>
    </figure>
  );
};
