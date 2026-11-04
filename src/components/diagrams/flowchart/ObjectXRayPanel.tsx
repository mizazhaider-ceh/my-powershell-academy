import React from 'react';
import { Code2 } from 'lucide-react';
import { ObjectStructureBlueprint } from '../../../types';

interface ObjectXRayPanelProps {
  blueprint: ObjectStructureBlueprint;
  selectedMemberIdx: number;
  onSelectMember: (idx: number) => void;
}

export const ObjectXRayPanel: React.FC<ObjectXRayPanelProps> = ({
  blueprint,
  selectedMemberIdx,
  onSelectMember,
}) => {
  const activeMember = blueprint.members[selectedMemberIdx] || blueprint.members[0];

  return (
    <div className="space-y-6" data-testid="object-svg-panel">
      <div className="clay-well p-4 sm:p-5 overflow-x-auto">
        <svg
          viewBox="0 0 920 300"
          className="w-full min-w-[42.5rem] h-auto select-none"
          role="img"
          aria-label={`Object-oriented data structure SVG for ${blueprint.typeName}`}
        >
          <rect x="24" y="82" width="300" height="136" rx="28" fill="#ded0f9" stroke="#383139" strokeWidth="2.5" />
          <text x="44" y="114" fontSize="10.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#48404b">
            .NET CLASS / KERNEL STRUCTURE
          </text>
          <text x="44" y="142" fontSize="13.5" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#383139">
            {blueprint.typeName.length > 32 ? `${blueprint.typeName.slice(0, 31)}...` : blueprint.typeName}
          </text>
          <text x="44" y="168" fontSize="11.5" fontWeight="600" fontFamily="Instrument Sans, sans-serif" fill="#383139">
            {blueprint.layerOrNamespace.length > 38
              ? `${blueprint.layerOrNamespace.slice(0, 37)}...`
              : blueprint.layerOrNamespace}
          </text>
          <text x="44" y="196" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="#383139">
            {blueprint.members.length} Inspectable Members -&gt;
          </text>

          {blueprint.members.map((member, idx) => {
            const total = blueprint.members.length;
            const spacing = Math.min(54, Math.floor(260 / Math.max(1, total)));
            const startY = 150 - ((total - 1) * spacing) / 2;
            const nodeY = startY + idx * spacing - 20;
            const nodeX = 430;
            const isSelected = idx === selectedMemberIdx;
            const isMethod = member.kind === 'method';
            const truncMemberName = member.name.length > 22 ? `${member.name.slice(0, 21)}...` : member.name;
            const truncDataType = member.dataType.length > 22 ? `${member.dataType.slice(0, 21)}...` : member.dataType;

            return (
              <g
                key={member.name}
                onClick={() => onSelectMember(idx)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${member.kind} ${member.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectMember(idx);
                  }
                }}
              >
                <path
                  d={`M 324 150 C 375 150, 380 ${nodeY + 20}, ${nodeX} ${nodeY + 20}`}
                  fill="none"
                  stroke="#383139"
                  strokeWidth={isSelected ? '3' : '1.75'}
                />
                <rect
                  x={nodeX}
                  y={nodeY}
                  width="465"
                  height="40"
                  rx="16"
                  fill={isSelected ? '#bfdbfe' : '#ffffff'}
                  stroke={isSelected ? '#1d4ed8' : '#0f172a'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />
                <rect
                  x={nodeX + 10}
                  y={nodeY + 8}
                  width="86"
                  height="24"
                  rx="10"
                  fill={isSelected ? '#1d4ed8' : isMethod ? '#e0e7ff' : '#c0efdc'}
                />
                <text
                  x={nodeX + 53}
                  y={nodeY + 24}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="800"
                  fontFamily="JetBrains Mono, monospace"
                  fill={isSelected ? '#ffffff' : '#0f172a'}
                >
                  {member.kind.toUpperCase()}
                </text>
                <text x={nodeX + 108} y={nodeY + 25} fontSize="12" fontWeight="800" fontFamily="JetBrains Mono, monospace" fill="#383139">
                  .{truncMemberName}
                </text>
                <text x={nodeX + 450} y={nodeY + 24} textAnchor="end" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono, monospace" fill="#48404b">
                  [{truncDataType}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {activeMember && (
        <div className="clay-card p-5 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="guide-num-badge uppercase">{activeMember.kind}</span>
              <span className="font-mono text-[1.125rem] font-bold">.{activeMember.name}</span>
            </div>
            <span className="font-mono text-[0.8125rem] font-bold">.NET Type: [{activeMember.dataType}]</span>
          </div>

          <p className="text-[1rem] leading-relaxed">{activeMember.plainEnglish}</p>

          <div className="clay-cushion-warm p-3.5 rounded-[1.25rem] flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <Code2 className="w-4 h-4" />
              <span>Example Value / Invocation:</span>
            </span>
            <code className="font-bold">{activeMember.sampleValue}</code>
          </div>
        </div>
      )}
    </div>
  );
};
