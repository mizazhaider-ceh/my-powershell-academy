import React, { useState } from 'react';
import { Copy, Check, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  output?: string;
  title?: string;
  language?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  output,
  title,
  language = 'powershell',
  showLineNumbers = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-stone-200/90 dark:border-stone-800/90 bg-stone-900 text-stone-100 shadow-sm font-mono text-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-stone-950/80 border-b border-stone-800/80 text-stone-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          {title ? (
            <span className="text-stone-300 font-semibold text-[11px] ml-2 truncate">
              {title}
            </span>
          ) : (
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 ml-2">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {output && (
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-200 px-2 py-0.5 rounded hover:bg-stone-800/80 transition-colors"
            >
              <Terminal className="w-3 h-3 text-blue-400" />
              <span>{showOutput ? 'Hide Output' : 'View Output'}</span>
              {showOutput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white px-2 py-0.5 rounded bg-stone-800/60 hover:bg-stone-800 transition-colors"
            title="Copy snippet"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="p-4 overflow-x-auto bg-[#0d1117] text-[#c9d1d9] leading-relaxed">
        {showLineNumbers ? (
          <table className="border-collapse w-full">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-stone-800/30">
                  <td className="pr-4 text-stone-600 select-none text-right w-8 align-top text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre align-top">
                    <code>{line || ' '}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="whitespace-pre">
            <code>{code}</code>
          </pre>
        )}
      </div>

      {/* Illustrative Terminal Output */}
      {output && showOutput && (
        <div className="border-t border-stone-800 bg-[#090d16] p-3.5 text-stone-300">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-2 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>PowerShell Console Output</span>
          </div>
          <pre className="text-[11px] font-mono text-sky-200/90 whitespace-pre overflow-x-auto leading-normal bg-black/40 p-2.5 rounded border border-stone-800/60">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};
