# PowerShell Academy: Learn PowerShell. Understand Everything.

**Created by Muhammad Izaz Haider**

An interactive, hands-on engineering handbook and lab platform for mastering Windows Internals, the PowerShell Object Pipeline, Server Core and Active Directory fleet automation, and Red/Blue Team PowerShell security.

It is a fully static, client-side React app: no backend, no API keys, no tracking. Progress is saved in your browser's `localStorage`.

---

## Curriculum Overview

**4 Tracks · 16 Modules · 35 Lessons · 21-Cmdlet Reference · 31-Term Glossary · 30-Question Drill Suite · 6 Practice Labs**

### Track 1: Windows Internals
| # | Module |
|---|---|
| 01 | Inside the Windows Kernel: Processes, Threads & Memory |
| 02 | Rings of Power: User Mode, Kernel Mode & The Boot Chain |

### Track 2: Advanced Object Pipeline
| # | Module |
|---|---|
| 03 | The Object Revolution: Why I Stopped Parsing Text |
| 04 | X-Ray Vision: Objects, Properties, Methods & Custom Types |
| 05 | Mastering the Pipeline & Parameter Binding |
| 06 | Variables, Type Casting, Quotes & Secure Input |
| 07 | Precision Filtering, Sorting & Safety Switches |

### Track 3: Systems & Fleet Automation
| # | Module |
|---|---|
| 08 | Everything Is a Drive: Providers, Registry & File Hunting |
| 09 | Building a Headless Windows Server Core from Scratch |
| 10 | Scripts, Execution Policies & Control Flow Logic |
| 11 | Modules, PowerShell Gallery & WinRM Remoting |
| 12 | Active Directory, Domain Controllers, DNS & Password Policies |
| 13 | Group Policy (GPO), Windows Firewall & Task Automation |
| 14 | Professional Toolmaking: Advanced Functions, Splatting & Error Handling |

### Track 4: PowerShell for Ethical Hackers
| # | Module |
|---|---|
| 15 | PowerShell for Ethical Hackers & Offensive Security |
| 16 | Blue Team Forensics, Threat Hunting & Enterprise Hardening |

---

## Interactive Simulators & Diagrams

**In-lesson simulators**
- Syscall Animator (Ring 3 → NTDLL → ntoskrnl → HAL)
- Virtual Memory Pager (4 KB pages, RAM vs pagefile)
- System Processes Stepper + Malware Process Hunter (spot imposter processes)
- 512-byte MBR Byte Inspector
- Cmdlet Anatomy, Core Network, and Offensive Kill-Chain SVG diagrams
- Pipeline Object Visualizer and .NET Object Anatomy
- Auto-generated 4-stage pipeline flowchart, process tree, and object X-ray for every lesson

**Practice & Drills labs** (`/knowledge`)
1. Fix Broken Scripts
2. Base64 & Event 4104 decoding
3. Parameter Binding Tracer (ByValue vs ByPropertyName)
4. Server Core `.ps1` Builder
5. @Splatting & ADSI LDAP refactor
6. .NET OutputType Flashcards

---

## Tech Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · lucide-react

```
src/
  App.tsx          # lightweight pushState router, theme, Ctrl+K search
  views/           # one component per route
  components/      # lesson, home, diagrams, interactive labs, quiz, common
  data/            # all course content (chapters, lessons, commands, glossary, quizzes)
  utils/           # flowchart synthesis, pedagogy helpers, search index, progress
tests/unit/        # content integrity and architecture tests
```

Routes: `/`, `/learn`, `/learn/:chapterId`, `/learn/:chapterId/:lessonSlug`, `/roadmap`, `/commands`, `/commands/:cmdlet`, `/knowledge`, `/glossary?q=term`, `/about`.

> Because routing uses the History API, configure your host to rewrite unknown paths to `index.html` (SPA fallback).

---

## Local Development

```bash
npm install        # install dependencies
npm run dev        # dev server on http://localhost:3000
npm test           # unit & content integrity tests
npm run lint       # TypeScript type-check
npm run build      # production build to dist/
```

---

## Author

**Created by Muhammad Izaz Haider**
