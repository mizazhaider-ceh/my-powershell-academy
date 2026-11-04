import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TrackCategory } from '../../types';
import { TrackIllustration } from '../diagrams/TrackIllustration';

interface HeroTrackCushionsProps {
  onNavigate: (path: string) => void;
}

const SUPPORTING_TRACK_CUSHIONS: {
  number: string;
  track: TrackCategory;
  modules: string;
  summary: string;
  cushionClass: string;
  firstPath: string;
}[] = [
  {
    number: '01',
    track: 'Windows Internals',
    modules: 'Modules 01 to 02',
    summary:
      'How Windows works under the hood: NT kernel, processes, threads, 4 KB pages, NTDLL syscalls, and UEFI boot.',
    cushionClass: 'clay-cushion-mint',
    firstPath: '/learn/chapter-01/windows-evolution-and-least-privilege',
  },
  {
    number: '02',
    track: 'Advanced Object Pipeline',
    modules: 'Modules 03 to 07',
    summary:
      'How PowerShell thinks in .NET objects: Verb-Noun cmdlets, Get-Help, Get-Member, pipeline binding, and filtering.',
    cushionClass: 'clay-cushion-warm',
    firstPath: '/learn/chapter-03/what-is-powershell',
  },
  {
    number: '03',
    track: 'Systems & Fleet Automation',
    modules: 'Modules 08 to 14',
    summary:
      'From one machine to many: PSProviders, Server Core build, scripts, loops, WinRM, Active Directory, GPO, and tools.',
    cushionClass: 'clay-cushion-cool',
    firstPath: '/learn/chapter-09/headless-server-core-build',
  },
  {
    number: '04',
    track: 'PowerShell for Ethical Hackers',
    modules: 'Modules 15 to 16',
    summary:
      'Offensive and defensive mastery: native [adsisearcher] AD recon, AMSI memory hooks, Event ID 4104, CLM, and JEA.',
    cushionClass: 'clay-cushion-lavender',
    firstPath: '/learn/chapter-15/offensive-recon-and-ad-enum',
  },
];

export const HeroTrackCushions: React.FC<HeroTrackCushionsProps> = ({
  onNavigate,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
      {SUPPORTING_TRACK_CUSHIONS.map((item) => (
        <button
          key={item.track}
          type="button"
          onClick={() => onNavigate(item.firstPath)}
          className={`${item.cushionClass} clay-card-interactive p-4 sm:p-5 text-left flex flex-col justify-between cursor-pointer`}
        >
          <div className="space-y-3">
            <TrackIllustration track={item.track} />
            <div className="flex items-center justify-between text-[0.75rem] font-mono font-extrabold opacity-85 pt-1">
              <span>TRACK {item.number}</span>
              <span>{item.modules}</span>
            </div>
            <h2 className="text-[1.125rem] font-extrabold leading-snug">
              {item.track}
            </h2>
            <p className="text-[0.875rem] opacity-90 leading-relaxed font-medium">
              {item.summary}
            </p>
          </div>
          <div className="mt-4 pt-2.5 border-t border-black/10 flex items-center justify-between text-[0.75rem] font-mono font-extrabold">
            <span>Begin Track</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      ))}
    </div>
  );
};
