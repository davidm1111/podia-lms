// WebAssembly Python Runner (Pyodide) for interactive Notebook code execution
// Runs 100% inside the browser on Cloudflare Pages with zero backend server costs!

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
    pyodideInstance?: any;
  }
}

let pyodidePromise: Promise<any> | null = null;

export async function getPyodide(): Promise<any> {
  if (window.pyodideInstance) {
    return window.pyodideInstance;
  }

  if (pyodidePromise) {
    return pyodidePromise;
  }

  pyodidePromise = new Promise(async (resolve, reject) => {
    try {
      // Dynamically inject Pyodide script if not present
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise((res, rej) => {
          script.onload = res;
          script.onerror = () => rej(new Error('No se pudo cargar el entorno de ejecución Python en el navegador'));
        });
      }

      if (window.loadPyodide) {
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });
        window.pyodideInstance = pyodide;
        resolve(pyodide);
      } else {
        reject(new Error('Pyodide no está disponible'));
      }
    } catch (err) {
      pyodidePromise = null;
      reject(err);
    }
  });

  return pyodidePromise;
}

export interface PyExecutionResult {
  stdout: string;
  result?: string;
  error?: string;
  executionTimeMs: number;
}

export async function runPythonCode(code: string): Promise<PyExecutionResult> {
  const startTime = performance.now();
  try {
    const pyodide = await getPyodide();

    // Setup stdout capture
    let stdoutBuffer = '';
    pyodide.setStdout({
      batched: (text: string) => {
        stdoutBuffer += text + '\n';
      },
    });

    // Run Python code
    const rawResult = await pyodide.runPythonAsync(code);
    const endTime = performance.now();

    return {
      stdout: stdoutBuffer.trimEnd(),
      result: rawResult !== undefined && rawResult !== null ? String(rawResult) : undefined,
      executionTimeMs: Math.round(endTime - startTime),
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      stdout: '',
      error: err.message || 'Error durante la ejecución del código Python',
      executionTimeMs: Math.round(endTime - startTime),
    };
  }
}
