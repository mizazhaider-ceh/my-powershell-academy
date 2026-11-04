import React, { useState } from 'react';
import { Server, Download, Copy, Check } from 'lucide-react';
import { generateServerCorePlaybookScript } from '../../data/labScenarios';

export const ServerCoreBuilderLab: React.FC = () => {
  const [hostname, setHostname] = useState('SRV-CORE-01');
  const [ipAddress, setIpAddress] = useState('192.168.10.20');
  const [prefixLength, setPrefixLength] = useState('24');
  const [gateway, setGateway] = useState('192.168.10.1');
  const [dnsServer, setDnsServer] = useState('192.168.10.10');
  const [interfaceAlias, setInterfaceAlias] = useState('Ethernet');
  const [adminUser, setAdminUser] = useState('IzazAdmin');
  const [copied, setCopied] = useState(false);

  const generatedScript = generateServerCorePlaybookScript({
    hostname,
    ipAddress,
    prefixLength,
    gateway,
    dnsServer,
    interfaceAlias,
    adminUser,
  });

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleDownloadPs1 = () => {
    const blob = new Blob([generatedScript], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `configure-${hostname.toLowerCase()}.ps1`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fields = [
    {
      label: 'Target Server Hostname',
      value: hostname,
      onChange: setHostname,
      span: 'col-span-2',
    },
    {
      label: 'Static IPv4',
      value: ipAddress,
      onChange: setIpAddress,
      span: 'col-span-1',
    },
    {
      label: 'CIDR /Prefix',
      value: prefixLength,
      onChange: setPrefixLength,
      span: 'col-span-1',
    },
    {
      label: 'Default Gateway',
      value: gateway,
      onChange: setGateway,
      span: 'col-span-1',
    },
    {
      label: 'DNS Server IP',
      value: dnsServer,
      onChange: setDnsServer,
      span: 'col-span-1',
    },
    {
      label: 'NIC InterfaceAlias',
      value: interfaceAlias,
      onChange: setInterfaceAlias,
      span: 'col-span-1',
    },
    {
      label: 'Local Admin User',
      value: adminUser,
      onChange: setAdminUser,
      span: 'col-span-1',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 text-[0.75rem] font-mono font-extrabold uppercase tracking-wider text-[var(--dp-color-accent)]">
          <Server className="w-4 h-4" />
          <span>Module 09 Generator · Zero-GUI Server Core Playbook</span>
        </div>
        <h3 className="text-[1.375rem] sm:text-[1.625rem] font-extrabold text-[var(--dp-color-ink)]">
          Interactive Headless Server Core Script Builder (.ps1)
        </h3>
        <p className="text-[0.9375rem] text-[var(--dp-color-ink-secondary)] font-medium leading-relaxed">
          Customize your network interface, static IPv4, DNS resolver, and
          hostname below to generate and download a production-ready{' '}
          <code className="font-mono font-bold">
            configureCoreServerBasic.ps1
          </code>{' '}
          deployment script.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 clay-well p-5 grid grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.label} className={f.span}>
              <label className="block text-[0.75rem] font-mono font-extrabold uppercase mb-1">
                {f.label}
              </label>
              <input
                type="text"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl clay-card font-mono text-[0.85rem] font-bold"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 p-5 rounded-[1.5rem] clay-terminal space-y-3 font-mono text-[0.8rem]">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <span className="text-[#93c5fd] text-[0.75rem] font-extrabold">
              configure-{hostname.toLowerCase()}.ps1
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[0.75rem] font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadPs1}
                className="px-3.5 py-1 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[0.75rem] font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .ps1</span>
              </button>
            </div>
          </div>
          <pre className="text-[#fde68a] overflow-x-auto leading-relaxed">
            <code>{generatedScript}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
