/**
 * The one lab universe used everywhere in the platform (lessons, guides, labs, setup page).
 * example.com is reserved for documentation, so it can never collide with a real domain.
 */
export const LAB_ENVIRONMENT = {
  domain: 'corp.example.com',
  netbios: 'CORP',
  subnet: '192.168.56.0/24',
  prefixLength: 24,
  dnsServer: '192.168.56.10',
  switchName: 'LabNet',
  hosts: [
    {
      name: 'DC01',
      role: 'Domain controller and DNS server',
      ip: '192.168.56.10',
      os: 'Windows Server evaluation',
      ramGb: 2,
      diskGb: 40,
    },
    {
      name: 'SRV-CORE01',
      role: 'Member server (Server Core, no desktop)',
      ip: '192.168.56.20',
      os: 'Windows Server evaluation, Server Core',
      ramGb: 2,
      diskGb: 32,
    },
    {
      name: 'CLIENT01',
      role: 'Windows 11 client you run PowerShell from',
      ip: '192.168.56.30',
      os: 'Windows 11 evaluation or your own Windows 11 VM',
      ramGb: 4,
      diskGb: 64,
    },
  ],
} as const;

export type LabHost = (typeof LAB_ENVIRONMENT.hosts)[number];
