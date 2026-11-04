import type { LucideIcon } from 'lucide-react';
import {
  Monitor, Terminal, Cpu, HardDrive, Server, Database, Network, Globe, Lock, Key, ShieldCheck, ShieldAlert,
  User, Users, Folder, FileText, Search, Filter, Workflow, Layers, Package, Box, Settings, Wrench, Bug, Bell,
  Clock, Mail, Eye, Zap, Play, RefreshCw, Download, Upload, Trash2, Check, X, TriangleAlert, CircleHelp, BookOpen,
  Code, Cloud, Power, Fingerprint, Route, GitBranch, List, Table, Binary, Puzzle, Plug, Link, Sparkles, Scissors,
  Tag, Building, Briefcase, Container, Send, Inbox, Utensils, Truck, Plane, Ticket, Map as MapIcon, Compass, Flag,
  Gauge, Scale, Clipboard, DoorOpen, Hotel,
} from 'lucide-react';
import type { StoryIcon } from '../../types/storyboard';

export const STORY_ICON_MAP: Record<StoryIcon, LucideIcon> = {
  monitor: Monitor, terminal: Terminal, cpu: Cpu, 'hard-drive': HardDrive, server: Server, database: Database,
  network: Network, globe: Globe, lock: Lock, key: Key, 'shield-check': ShieldCheck, 'shield-alert': ShieldAlert,
  user: User, users: Users, folder: Folder, 'file-text': FileText, search: Search, filter: Filter, workflow: Workflow,
  layers: Layers, package: Package, box: Box, settings: Settings, wrench: Wrench, bug: Bug, bell: Bell, clock: Clock,
  mail: Mail, eye: Eye, zap: Zap, play: Play, refresh: RefreshCw, download: Download, upload: Upload, trash: Trash2,
  check: Check, x: X, warning: TriangleAlert, help: CircleHelp, book: BookOpen, code: Code, cloud: Cloud, power: Power,
  fingerprint: Fingerprint, route: Route, 'git-branch': GitBranch, list: List, table: Table, binary: Binary,
  puzzle: Puzzle, plug: Plug, link: Link, sparkles: Sparkles, scissors: Scissors, tag: Tag, building: Building,
  briefcase: Briefcase, container: Container, send: Send, inbox: Inbox, utensils: Utensils, truck: Truck,
  plane: Plane, ticket: Ticket, map: MapIcon, compass: Compass, flag: Flag, gauge: Gauge, scale: Scale,
  clipboard: Clipboard, 'door-open': DoorOpen, hotel: Hotel,
};
