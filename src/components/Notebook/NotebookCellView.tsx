import React, { useState } from 'react';
import type { NotebookCell } from '../../types';
import { normalizeSource, extractOutputs } from '../../lib/notebookParser';
import { highlightCode } from '../../lib/syntaxHighlight';
import { runPythonCode, type PyExecutionResult } from '../../lib/pyodideRunner';
import { MarkdownView } from '../MarkdownView';
import { Play, Check, Copy, Loader2, Sparkles, AlertCircle, Terminal } from 'lucide-react';

interface NotebookCellViewProps {
  cell: NotebookCell;
  index: number;
}

export const NotebookCellView: React.FC<NotebookCellViewProps> = ({ cell, index }) => {
  const isMarkdown = cell.cell_type === 'markdown';
  const rawSource = normalizeSource(cell.source);

  // State for interactive code execution
  const [isRunning, setIsRunning] = useState(false);
  const [interactiveResult, setInteractiveResult] = useState<PyExecutionResult | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [editableCode, setEditableCode] = useState(rawSource);
  const [isEditing, setIsEditing] = useState(false);

  // Copy code handler
  const handleCopy = () => {
    navigator.clipboard.writeText(editableCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Run cell via Pyodide WebAssembly
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await runPythonCode(editableCode);
      setInteractiveResult(res);
    } catch (err: any) {
      setInteractiveResult({
        stdout: '',
        error: err.message || 'Error desconocido al ejecutar código',
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (isMarkdown) {
    return (
      <div className="py-3 px-1 my-2">
        <MarkdownView content={rawSource} />
      </div>
    );
  }

  // Pre-calculated outputs from the original notebook file
  const originalOutputs = extractOutputs(cell.outputs);
  const highlightedCode = highlightCode(editableCode, 'python');

  return (
    <div className="my-5 rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden transition-all hover:border-purple-200">
      {/* Code Cell Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#faf8f5] border-b border-stone-200/80 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-semibold text-[#281434] bg-purple-100/70 px-2 py-0.5 rounded text-[11px]">
            In [{cell.execution_count ?? index + 1}]
          </span>
          <span className="text-stone-500 font-medium">Python 3</span>
          {interactiveResult && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {interactiveResult.executionTimeMs} ms
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-2.5 py-1 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium transition-colors text-xs"
          >
            {isEditing ? 'Vista previa' : 'Editar'}
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
            title="Copiar código"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 bg-[#724ae8] hover:bg-[#5d38cc] disabled:bg-purple-300 text-white font-medium px-3 py-1 rounded-full text-xs shadow-xs transition-all active:scale-95"
            title="Ejecutar en tu navegador con WebAssembly Python"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Ejecutando...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Ejecutar celda</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor / Highlighting */}
      <div className="relative bg-[#1e1b2e] text-stone-100 font-mono text-[13.5px] leading-relaxed">
        {isEditing ? (
          <textarea
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            className="w-full p-4 bg-transparent text-stone-100 font-mono text-[13.5px] leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-purple-400 min-h-[100px]"
            rows={Math.max(3, editableCode.split('\n').length)}
            spellCheck={false}
          />
        ) : (
          <pre className="p-4 overflow-x-auto selection:bg-purple-900 selection:text-white">
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>
        )}
      </div>

      {/* Outputs Area */}
      {/* 1. Interactive WebAssembly Result (if run by user) */}
      {interactiveResult && (
        <div className="border-t border-purple-100 bg-purple-50/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-900 mb-2">
            <Terminal className="w-3.5 h-3.5 text-purple-700" />
            <span>Resultado de ejecución en vivo (WebAssembly)</span>
          </div>

          {interactiveResult.stdout && (
            <pre className="p-3 rounded-xl bg-[#14121d] text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800">
              {interactiveResult.stdout}
            </pre>
          )}

          {interactiveResult.result && (
            <div className="mt-2 text-xs font-mono text-purple-950 bg-white p-2.5 rounded-lg border border-purple-200">
              <span className="text-purple-600 font-semibold">Out: </span>
              {interactiveResult.result}
            </div>
          )}

          {interactiveResult.error && (
            <div className="mt-2 text-xs font-mono text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <pre className="overflow-x-auto whitespace-pre-wrap">{interactiveResult.error}</pre>
            </div>
          )}
        </div>
      )}

      {/* 2. Original Pre-rendered Notebook Outputs */}
      {!interactiveResult && originalOutputs.length > 0 && (
        <div className="border-t border-stone-200 bg-[#fbfaf8] p-4 space-y-3">
          <div className="text-[11px] font-mono text-stone-500 font-medium">
            Out [{cell.execution_count ?? index + 1}]:
          </div>

          {originalOutputs.map((out) => {
            if (!out) return null;

            // Plain text stream output
            if (out.type === 'text') {
              return (
                <pre
                  key={out.key}
                  className="p-3 rounded-xl bg-white border border-stone-200 font-mono text-xs text-stone-800 overflow-x-auto leading-relaxed shadow-2xs"
                >
                  {out.content}
                </pre>
              );
            }

            // HTML Output (Pandas DataFrames, etc.)
            if (out.type === 'html') {
              return (
                <div
                  key={out.key}
                  className="overflow-x-auto my-2"
                  dangerouslySetInnerHTML={{ __html: out.content || '' }}
                />
              );
            }

            // Image Output (Matplotlib charts)
            if (out.type === 'image') {
              return (
                <div key={out.key} className="my-2 p-2 bg-white rounded-xl border border-stone-200 inline-block shadow-2xs">
                  <img src={out.src} alt="Notebook chart output" className="max-w-full rounded h-auto" />
                </div>
              );
            }

            // SVG Output (Vector graphics)
            if (out.type === 'svg') {
              return (
                <div
                  key={out.key}
                  className="my-2 p-3 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: out.content || '' }}
                />
              );
            }

            // Error output
            if (out.type === 'error') {
              return (
                <div key={out.key} className="p-3 rounded-xl bg-rose-50 border border-rose-200 font-mono text-xs text-rose-800">
                  <div className="font-bold">{out.name}: {out.value}</div>
                  <pre className="mt-1 text-[11px] whitespace-pre-wrap">{out.traceback}</pre>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
};
