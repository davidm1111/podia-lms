import React, { useState, useRef } from 'react';
import type { JupyterNotebook } from '../../types';
import { parseNotebook, getNotebookStats } from '../../lib/notebookParser';
import { Upload, FileCode, CheckCircle2, AlertCircle, Layers, Cpu } from 'lucide-react';

interface NotebookUploaderProps {
  onNotebookLoaded: (notebook: JupyterNotebook, fileName: string) => void;
  title?: string;
  subtitle?: string;
}

export const NotebookUploader: React.FC<NotebookUploaderProps> = ({
  onNotebookLoaded,
  title = 'Sube tu archivo Jupyter Notebook (.ipynb)',
  subtitle = 'Arrastra y suelta tu archivo .ipynb aquí o haz clic para explorar',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedStats, setLoadedStats] = useState<any | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.ipynb') && !file.type.includes('json')) {
      setError('Por favor selecciona un archivo con extensión .ipynb (Jupyter Notebook)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseNotebook(text);
        const stats = getNotebookStats(parsed);
        setLoadedStats(stats);
        setCurrentFileName(file.name);
        onNotebookLoaded(parsed, file.name);
      } catch (err: any) {
        setError(err.message || 'Error al analizar el archivo .ipynb');
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#724ae8] bg-purple-50/70 scale-[1.01]'
            : 'border-stone-300 hover:border-purple-300 bg-white hover:bg-[#faf8f5]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".ipynb,application/x-ipynb+json"
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#724ae8] mx-auto flex items-center justify-center mb-4 shadow-2xs">
          <Upload className="w-7 h-7" />
        </div>

        <h4 className="text-base font-bold text-[#281434]">{title}</h4>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">{subtitle}</p>

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#724ae8] hover:bg-[#5d38cc] text-white text-xs font-semibold shadow-xs">
          <FileCode className="w-4 h-4" />
          <span>Examinar archivos locales</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Loaded Success Card */}
      {loadedStats && currentFileName && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-900">{currentFileName}</div>
              <div className="flex items-center gap-3 text-[11px] text-emerald-700 mt-0.5">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {loadedStats.totalCells} celdas ({loadedStats.codeCells} código, {loadedStats.markdownCells} texto)
                </span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  {loadedStats.language}
                </span>
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            Listo
          </span>
        </div>
      )}
    </div>
  );
};
