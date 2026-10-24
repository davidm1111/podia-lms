import type { JupyterNotebook, NotebookCellOutput } from '../types';

/**
 * Normalizes cell source or output text into a single joined string
 */
export function normalizeSource(source: string | string[] | undefined): string {
  if (!source) return '';
  if (Array.isArray(source)) {
    return source.join('');
  }
  return source;
}

/**
 * Parses raw JSON string into a validated Jupyter Notebook
 */
export function parseNotebook(rawJson: string): JupyterNotebook {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || !Array.isArray(parsed.cells)) {
      throw new Error('El archivo no tiene el formato estándar de Jupyter Notebook (.ipynb)');
    }
    return {
      cells: parsed.cells.map((cell: any, index: number) => ({
        id: cell.id || `cell-${index}`,
        cell_type: cell.cell_type || 'code',
        source: cell.source || '',
        execution_count: cell.execution_count ?? null,
        outputs: Array.isArray(cell.outputs) ? cell.outputs : [],
        metadata: cell.metadata || {},
      })),
      metadata: parsed.metadata || {},
      nbformat: parsed.nbformat || 4,
      nbformat_minor: parsed.nbformat_minor || 5,
    };
  } catch (error: any) {
    throw new Error(`Error al leer el Notebook: ${error.message}`);
  }
}

/**
 * Extracts preview statistics from a notebook (total cells, markdown cells, code cells)
 */
export function getNotebookStats(notebook: JupyterNotebook) {
  let markdownCells = 0;
  let codeCells = 0;
  let hasOutputs = 0;

  for (const cell of notebook.cells) {
    if (cell.cell_type === 'markdown') markdownCells++;
    if (cell.cell_type === 'code') {
      codeCells++;
      if (cell.outputs && cell.outputs.length > 0) hasOutputs++;
    }
  }

  return {
    totalCells: notebook.cells.length,
    markdownCells,
    codeCells,
    hasOutputs,
    language: notebook.metadata?.kernelspec?.display_name || notebook.metadata?.language_info?.name || 'Python 3',
  };
}

/**
 * Serializes a notebook back to standard .ipynb JSON format for download
 */
export function serializeNotebook(notebook: JupyterNotebook): string {
  return JSON.stringify(notebook, null, 2);
}

/**
 * Initiates browser download of an .ipynb file
 */
export function downloadNotebookFile(notebook: JupyterNotebook, filename: string = 'notebook.ipynb') {
  const json = serializeNotebook(notebook);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ipynb') ? filename : `${filename}.ipynb`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Extracts and sanitizes output elements from code cell outputs
 */
export function extractOutputs(outputs?: NotebookCellOutput[]) {
  if (!outputs || outputs.length === 0) return [];

  return outputs.map((out, index) => {
    // 1. Text stream output (stdout / stderr)
    if (out.output_type === 'stream') {
      return {
        key: `out-stream-${index}`,
        type: 'text',
        streamName: out.name || 'stdout',
        content: normalizeSource(out.text),
      };
    }

    // 2. Display data / execute result (HTML, Images, text)
    if (out.output_type === 'display_data' || out.output_type === 'execute_result') {
      const data = out.data || {};

      // Image PNG
      if (data['image/png']) {
        return {
          key: `out-img-png-${index}`,
          type: 'image',
          mime: 'image/png',
          src: `data:image/png;base64,${data['image/png']}`,
        };
      }

      // Image JPEG
      if (data['image/jpeg']) {
        return {
          key: `out-img-jpeg-${index}`,
          type: 'image',
          mime: 'image/jpeg',
          src: `data:image/jpeg;base64,${data['image/jpeg']}`,
        };
      }

      // Image SVG
      if (data['image/svg+xml']) {
        return {
          key: `out-img-svg-${index}`,
          type: 'svg',
          content: normalizeSource(data['image/svg+xml']),
        };
      }

      // HTML (e.g. Pandas DataFrame tabular representation)
      if (data['text/html']) {
        return {
          key: `out-html-${index}`,
          type: 'html',
          content: normalizeSource(data['text/html']),
        };
      }

      // Plain text fallback
      if (data['text/plain']) {
        return {
          key: `out-plain-${index}`,
          type: 'text',
          content: normalizeSource(data['text/plain']),
        };
      }
    }

    // 3. Error traceback
    if (out.output_type === 'error') {
      const traceback = Array.isArray(out.traceback) ? out.traceback.join('\n') : `${out.ename}: ${out.evalue}`;
      // Clean ANSI escape codes from traceback for clean reading
      const cleanTraceback = traceback.replace(/\u001b\[[0-9;]*m/g, '');
      return {
        key: `out-err-${index}`,
        type: 'error',
        name: out.ename || 'Error',
        value: out.evalue || '',
        traceback: cleanTraceback,
      };
    }

    return null;
  }).filter(Boolean);
}
