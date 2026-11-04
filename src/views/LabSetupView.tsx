import React from 'react';
import { Server, ShieldAlert } from 'lucide-react';
import { LAB_REQUIREMENTS, LAB_SAFETY, LAB_STEPS } from '../data/labSetup';
import { CodeBlock } from '../components/common/CodeBlock';
import { LabNetworkDiagram } from '../components/start/LabNetworkDiagram';

export const LabSetupView: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <div className="max-w-[58rem] mx-auto px-3 sm:px-6 py-6 space-y-8">
    <header className="clay-cushion-pink p-7 sm:p-10 space-y-4">
      <span className="tc-label">Lab setup</span>
      <h1 className="text-[2rem] sm:text-[2.6rem] font-extrabold leading-tight">Build your practice lab</h1>
      <p className="text-[1.05rem] leading-relaxed max-w-[42rem]">
        Three small virtual machines on a private network, and nothing real at risk. Modules 3 to 8 do not need it, so you can
        start learning today and come back here when you reach servers and Active Directory.
      </p>
    </header>

    <section className="clay-tray p-6 sm:p-8 space-y-4" aria-labelledby="lab-map">
      <div className="flex items-center gap-2"><Server className="w-5 h-5" /><h2 id="lab-map" className="text-[1.35rem] font-bold">What you are building</h2></div>
      <LabNetworkDiagram />
    </section>

    <section className="grid gap-3 sm:grid-cols-2" aria-label="What your PC needs">
      {LAB_REQUIREMENTS.map((req) => (
        <div key={req.label} className="clay-card p-5 space-y-1">
          <p className="text-[0.75rem] font-mono font-bold uppercase tracking-wider opacity-75">{req.label}</p>
          <p className="text-[1.15rem] font-bold">{req.value}</p>
          <p className="text-[0.9rem] leading-relaxed">{req.why}</p>
        </div>
      ))}
    </section>

    <ol className="space-y-5 list-none p-0">
      {LAB_STEPS.map((step, i) => (
        <li key={step.title}>
          <section className="clay-tray p-6 sm:p-8 space-y-4" aria-labelledby={`lab-step-${i}`}>
            <div className="flex items-center gap-3">
              <span className="guide-num-badge" aria-hidden="true">{i + 1}</span>
              <h2 id={`lab-step-${i}`} className="text-[1.3rem] sm:text-[1.5rem] font-bold">{step.title}</h2>
            </div>
            {step.body.map((p) => (
              <p key={p} className="text-[1.02rem] leading-relaxed">{p}</p>
            ))}
            {step.code && <CodeBlock code={step.code} title={step.title} />}
            {step.tip && (
              <p className="clay-cushion-lavender p-4 text-[0.93rem] leading-relaxed"><b>Good to know. </b>{step.tip}</p>
            )}
          </section>
        </li>
      ))}
    </ol>

    <section className="clay-tray-lavender p-6 sm:p-8 space-y-4" aria-labelledby="lab-safety">
      <div className="flex items-center gap-2"><ShieldAlert className="w-5 h-5" /><h2 id="lab-safety" className="text-[1.35rem] font-bold">Keep it safe</h2></div>
      <ul className="space-y-2 pl-5 list-disc text-[1rem] leading-relaxed">
        {LAB_SAFETY.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
    </section>

    <button type="button" onClick={() => onNavigate('/start')} className="clay-btn-secondary px-6 py-3 text-[0.95rem] cursor-pointer">
      Back to Start here
    </button>
  </div>
);
