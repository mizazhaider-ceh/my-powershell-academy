import React from 'react';
import { TrackCategory } from '../../types';
import {
  TrackWindowsInternalsSvg,
  TrackObjectPipelineSvg,
} from './tracks/TrackInternalsAndPipelineSvg';
import {
  TrackFleetAutomationSvg,
  TrackEthicalHackersSvg,
} from './tracks/TrackFleetAndHackersSvg';

interface TrackIllustrationProps {
  track: TrackCategory;
  className?: string;
}

export const TrackIllustration: React.FC<TrackIllustrationProps> = ({
  track,
  className = '',
}) => {
  switch (track) {
    case 'Windows Internals':
      return <TrackWindowsInternalsSvg className={className} />;
    case 'Advanced Object Pipeline':
      return <TrackObjectPipelineSvg className={className} />;
    case 'Systems & Fleet Automation':
      return <TrackFleetAutomationSvg className={className} />;
    case 'PowerShell for Ethical Hackers':
      return <TrackEthicalHackersSvg className={className} />;
  }
};
