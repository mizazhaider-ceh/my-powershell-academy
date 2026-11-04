import React, { useState } from 'react';
import { HardDrive } from 'lucide-react';

export const MbrByteInspector: React.FC = () => {
  const [region, setRegion] = useState<'boot' | 'pt' | 'sig'>('boot');

  return (
    <div className="my-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
          Interactive Sector 0 Inspector: Inside the 512-Byte MBR vs GPT
        </span>
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Click any region of Sector 0 (the first 512 bytes of an MBR disk) to
        inspect its byte offsets and forensic vulnerability.
      </p>

      <div className="flex rounded-xl overflow-hidden border-2 border-stone-300 dark:border-stone-700 font-mono text-xs">
        <button
          onClick={() => setRegion('boot')}
          className={`flex-[5] p-3.5 text-center transition-colors cursor-pointer border-r border-stone-300 dark:border-stone-700 ${
            region === 'boot'
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20'
          }`}
        >
          <div>Bootstrap Code</div>
          <div className="text-[10px] opacity-80">
            446 Bytes (0x000 to 0x1BD)
          </div>
        </button>
        <button
          onClick={() => setRegion('pt')}
          className={`flex-[3] p-3.5 text-center transition-colors cursor-pointer border-r border-stone-300 dark:border-stone-700 ${
            region === 'pt'
              ? 'bg-purple-600 text-white font-bold'
              : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20'
          }`}
        >
          <div>Partition Table</div>
          <div className="text-[10px] opacity-80">64 Bytes (4 × 16B)</div>
        </button>
        <button
          onClick={() => setRegion('sig')}
          className={`flex-[2] p-3.5 text-center transition-colors cursor-pointer ${
            region === 'sig'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
          }`}
        >
          <div>0x55AA</div>
          <div className="text-[10px] opacity-80">2 Bytes</div>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs leading-relaxed space-y-2">
        {region === 'boot' && (
          <>
            <div className="font-bold text-blue-600 dark:text-blue-400 font-mono">
              Offsets 0 to 445 (446 Bytes): Legacy BIOS Bootstrap Code
            </div>
            <p className="text-stone-700 dark:text-stone-300">
              Legacy BIOS blindly reads these 446 bytes into memory and executes
              them with zero digital signature verification. That is why MBR
              bootkits love overwriting Sector 0: their code runs before Windows
              even wakes up! Modern UEFI + Secure Boot replaces this by
              verifying cryptographically signed `.efi` bootloaders inside the
              EFI System Partition.
            </p>
          </>
        )}
        {region === 'pt' && (
          <>
            <div className="font-bold text-purple-600 dark:text-purple-400 font-mono">
              Offsets 446 to 509 (64 Bytes): 4 Primary Partition Slots (16 Bytes
              Each)
            </div>
            <p className="text-stone-700 dark:text-stone-300">
              Because there are only four 16-byte slots, MBR is limited to{' '}
              <strong>4 primary partitions</strong> (or 3 primary + 1 extended
              partition) and 32-bit LBA addressing caps disk size at{' '}
              <strong>2 TB</strong>. Worse, all partition info sits in this
              single spot, if Sector 0 gets corrupted, the whole disk layout is
              lost! GPT fixes this with <strong>128 partitions</strong>,{' '}
              <strong>9.4 ZB</strong> max size, CRC32 checksums, and a duplicate
              backup header at the end of the disk.
            </p>
          </>
        )}
        {region === 'sig' && (
          <>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              Offsets 510 to 511 (2 Bytes): Boot Sector Signature (0x55AA)
            </div>
            <p className="text-stone-700 dark:text-stone-300">
              The final two bytes (`0x55` followed by `0xAA`) tell the firmware
              that this sector is a valid bootable disk. Without these exact two
              bytes, BIOS refuses to boot the drive.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
