import React from 'react';
import type { JupyterNotebook } from '../../types';
import { NotebookCellView } from './NotebookCellView';
import { getNotebookStats, downloadNotebookFile } from '../../lib/notebookParser';
import { Download, FileCode, Cpu, Layers } from 'lucide-react';

interface NotebookRendererProps {
  notebook: JupyterNotebook;
  fileName?: string;
  lessonTitle?: string;
}

export const NotebookRenderer: React.FC<NotebookRendererProps> = ({
  notebook,
  fileName = 'leccion.ipynb',
  lessonTitle,
}) => {
  const stats = getNotebookStats(notebook);

  const handleDownload = () => {
    downloadNotebookFile(notebook, fileName);
  };

  return (
    <div className="space-y-6">
      {/* Notebook Header Bar with Podia Styling */}
      <div className="bg-[#faf8f5] border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <FileCode className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-medium text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/50">
              {fileName}
            </span>
            <span className="text-xs text-stone-500 font-medium hidden md:inline">
              Jupyter v{notebook.nbformat}.{notebook.nbformat_minor}
            </span>
          </div>
          {lessonTitle && (
            <h3 className="text-base font-semibold text-[#281434]">{lessonTitle}</h3>
          )}
          <div className="flex items-center gap-3 text-xs text-stone-500 pt-0.5">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {stats.totalCells} celdas ({stats.codeCells} código, {stats.markdownCells} texto)
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              {stats.language}
            </span>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-[#281434] text-xs font-semibold border border-stone-200 shadow-2xs transition-all active:scale-95 shrink-0"
          title="Descargar este archivo .ipynb a tu ordenador"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          <span>Descargar .ipynb</span>
        </button>
      </div>

      {/* Cells List */}
      <div className="space-y-2">
        {notebook.cells.map((cell, idx) => (
          <NotebookCellView
            key={cell.id || `cell-${idx}`}
            cell={cell}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
};
