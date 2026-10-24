import type { Course, JupyterNotebook } from '../types';

// Realistic SVG charts encoded as data URLs for notebook output visualizations
const scatterPlotSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" width="100%" height="260">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <!-- Grid -->
  <line x1="50" y1="20" x2="50" y2="250" stroke="#e5e7eb" stroke-width="1.5"/>
  <line x1="50" y1="250" x2="480" y2="250" stroke="#e5e7eb" stroke-width="1.5"/>
  <line x1="50" y1="190" x2="480" y2="190" stroke="#f3f4f6" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="130" x2="480" y2="130" stroke="#f3f4f6" stroke-width="1" stroke-dasharray="4"/>
  <line x1="50" y1="70" x2="480" y2="70" stroke="#f3f4f6" stroke-width="1" stroke-dasharray="4"/>
  <!-- Axis labels -->
  <text x="260" y="285" fill="#6b7280" font-family="sans-serif" font-size="12" text-anchor="middle">Horas de Estudio (X)</text>
  <text x="20" y="140" fill="#6b7280" font-family="sans-serif" font-size="12" transform="rotate(-90 20 140)" text-anchor="middle">Calificación Examen (Y)</text>
  <!-- Regression line -->
  <line x1="60" y1="230" x2="460" y2="45" stroke="#724ae8" stroke-width="3" stroke-linecap="round"/>
  <!-- Data points -->
  <circle cx="75" cy="225" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="110" cy="210" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="140" cy="185" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="170" cy="195" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="210" cy="155" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="245" cy="135" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="280" cy="140" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="320" cy="110" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="360" cy="95" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="400" cy="65" r="5" fill="#281434" opacity="0.8"/>
  <circle cx="440" cy="50" r="5" fill="#281434" opacity="0.8"/>
  <!-- Title & Legend -->
  <text x="260" y="25" fill="#111827" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle">Ajuste de Regresión Lineal (R² = 0.942)</text>
</svg>`;

const lossCurveSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="240">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <line x1="50" y1="30" x2="50" y2="230" stroke="#e5e7eb" stroke-width="1.5"/>
  <line x1="50" y1="230" x2="470" y2="230" stroke="#e5e7eb" stroke-width="1.5"/>
  <!-- Loss path -->
  <path d="M 50 45 Q 120 180 200 205 T 350 215 T 470 218" fill="none" stroke="#e11d48" stroke-width="3"/>
  <text x="260" y="265" fill="#6b7280" font-family="sans-serif" font-size="12" text-anchor="middle">Épocas de Entrenamiento</text>
  <text x="20" y="130" fill="#6b7280" font-family="sans-serif" font-size="12" transform="rotate(-90 20 130)" text-anchor="middle">Función de Pérdida (MSE)</text>
  <text x="260" y="25" fill="#111827" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle">Convergencia del Descenso de Gradiente</text>
  <!-- Legend -->
  <circle cx="370" cy="50" r="4" fill="#e11d48"/>
  <text x="382" y="54" fill="#4b5563" font-family="sans-serif" font-size="11">Loss: 0.0034</text>
</svg>`;

// Notebook 1: Introducción a Python & Variables
export const notebookIntroPython: JupyterNotebook = {
  cells: [
    {
      id: 'cell-md-1',
      cell_type: 'markdown',
      source: [
        '# 🐍 Lección 1: Fundamentos de Python y Notebooks Interactivos\n',
        '¡Bienvenido al curso interactivo! En esta lección aprenderás los conceptos esenciales de Python que utilizaremos a lo largo de todo el programa.\n\n',
        '### ¿Qué es un Jupyter Notebook?\n',
        'Un notebook combina texto enriquecido (Markdown), bloques de código ejecutable y resultados visuales (gráficos, tablas y streams de datos).\n\n',
        '> **Objetivo de la lección:** Comprender tipos de datos dinámicos, list comprehensions y funciones con type hinting.',
      ],
      metadata: {},
    },
    {
      id: 'cell-code-1',
      cell_type: 'code',
      execution_count: 1,
      source: [
        '# Definición de estructuras de datos esenciales\n',
        'estudiante = {\n',
        '    "nombre": "Elena García",\n',
        '    "modulo": "Inteligencia Artificial",\n',
        '    "progreso": 85.5,\n',
        '    "completado": False\n',
        '}\n',
        '\n',
        'print(f"Estudiante: {estudiante[\'nombre\']} | Progreso: {estudiante[\'progreso\']}%")',
      ],
      outputs: [
        {
          output_type: 'stream',
          name: 'stdout',
          text: ['Estudiante: Elena García | Progreso: 85.5%\n'],
        },
      ],
      metadata: {},
    },
    {
      id: 'cell-md-2',
      cell_type: 'markdown',
      source: [
        '### ⚡ List Comprehensions y Filtrado de Datos\n',
        'Las comprensiones de listas son una de las herramientas más elegantes y rápidas de Python para transformar colecciones.',
      ],
      metadata: {},
    },
    {
      id: 'cell-code-2',
      cell_type: 'code',
      execution_count: 2,
      source: [
        '# Transformación de datos usando List Comprehensions\n',
        'calificaciones_brutas = [65, 88, 92, 45, 78, 96, 54, 89]\n',
        '\n',
        '# Filtrar aprobados (>= 70) y normalizar a escala 0 a 1\n',
        'aprobados_normalizados = [round(c / 100, 2) for c in calificaciones_brutas if c >= 70]\n',
        '\n',
        'print("Original:", calificaciones_brutas)\n',
        'print("Aprobados (0 a 1):", aprobados_normalizados)\n',
        'print("Tasa de aprobación:", f"{len(aprobados_normalizados) / len(calificaciones_brutas) * 100:.1f}%")',
      ],
      outputs: [
        {
          output_type: 'stream',
          name: 'stdout',
          text: [
            'Original: [65, 88, 92, 45, 78, 96, 54, 89]\n',
            'Aprobados (0 a 1): [0.88, 0.92, 0.78, 0.96, 0.89]\n',
            'Tasa de aprobación: 62.5%\n',
          ],
        },
      ],
      metadata: {},
    },
    {
      id: 'cell-md-3',
      cell_type: 'markdown',
      source: [
        '### 🚀 Ejercicio interactivo\n',
        'Puedes editar el código del recuadro siguiente y presionar el botón **"Ejecutar código"** para correrlo en tiempo real gracias al motor WebAssembly en tu navegador.',
      ],
      metadata: {},
    },
    {
      id: 'cell-code-3',
      cell_type: 'code',
      execution_count: 3,
      source: [
        'def calcular_metricas(valores):\n',
        '    promedio = sum(valores) / len(valores)\n',
        '    maximo = max(valores)\n',
        '    minimo = min(valores)\n',
        '    return {"promedio": round(promedio, 2), "max": maximo, "min": minimo}\n',
        '\n',
        'datos = [12, 45, 78, 92, 33, 67, 85]\n',
        'resultado = calcular_metricas(datos)\n',
        'print("Métricas calculadas:", resultado)',
      ],
      outputs: [
        {
          output_type: 'stream',
          name: 'stdout',
          text: ["Métricas calculadas: {'promedio': 58.86, 'max': 92, 'min': 12}\n"],
        },
      ],
      metadata: {},
    },
  ],
  metadata: {
    kernelspec: {
      display_name: 'Python 3 (ipykernel)',
      language: 'python',
      name: 'python3',
    },
    language_info: {
      name: 'python',
      version: '3.11.0',
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

// Notebook 2: Pandas DataFrames & HTML Tables
export const notebookPandasAnalysis: JupyterNotebook = {
  cells: [
    {
      id: 'cell-pd-1',
      cell_type: 'markdown',
      source: [
        '# 🐼 Análisis de Datos con Pandas & DataFrames\n',
        'Pandas es la biblioteca estándar de la industria para manipulación tabular de datos.\n',
        'En este notebook exploramos la carga, transformación y resumen estadístico de un dataset de estudiantes.',
      ],
      metadata: {},
    },
    {
      id: 'cell-pd-code-1',
      cell_type: 'code',
      execution_count: 1,
      source: [
        'import pandas as pd\n',
        'import numpy as np\n',
        '\n',
        '# Creando DataFrame representativo\n',
        'data = {\n',
        '    "Estudiante": ["Carlos Ruiz", "Sofia Chen", "Mateo Silva", "Lucia Vega", "Andrés Gómez"],\n',
        '    "Curso": ["Data Science", "Cloud Native", "Data Science", "Machine Learning", "Cloud Native"],\n',
        '    "Horas_Estudio": [24.5, 38.0, 15.2, 42.1, 29.8],\n',
        '    "Nota_Final": [88, 95, 74, 98, 86],\n',
        '    "Certificado": [True, True, False, True, True]\n',
        '}\n',
        'df = pd.DataFrame(data)\n',
        'df.head()',
      ],
      outputs: [
        {
          output_type: 'execute_result',
          execution_count: 1,
          data: {
            'text/plain': [
              '     Estudiante             Curso  Horas_Estudio  Nota_Final  Certificado\n',
              '0   Carlos Ruiz      Data Science           24.5          88         True\n',
              '1    Sofia Chen      Cloud Native           38.0          95         True\n',
              '2   Mateo Silva      Data Science           15.2          74        False\n',
              '3    Lucia Vega  Machine Learning           42.1          98         True\n',
              '4  Andrés Gómez      Cloud Native           29.8          86         True\n',
            ],
            'text/html': [
              `<table class="dataframe border-collapse w-full text-sm text-left my-3 shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <thead class="bg-purple-50 text-purple-950 font-semibold border-b border-purple-100">
                  <tr>
                    <th class="p-2.5">#</th>
                    <th class="p-2.5">Estudiante</th>
                    <th class="p-2.5">Curso</th>
                    <th class="p-2.5">Horas_Estudio</th>
                    <th class="p-2.5">Nota_Final</th>
                    <th class="p-2.5">Certificado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                  <tr class="hover:bg-purple-50/40"><td class="p-2.5 font-mono text-gray-500">0</td><td class="p-2.5 font-medium text-gray-900">Carlos Ruiz</td><td class="p-2.5">Data Science</td><td class="p-2.5">24.5</td><td class="p-2.5 font-semibold text-emerald-600">88</td><td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">Sí</span></td></tr>
                  <tr class="hover:bg-purple-50/40"><td class="p-2.5 font-mono text-gray-500">1</td><td class="p-2.5 font-medium text-gray-900">Sofia Chen</td><td class="p-2.5">Cloud Native</td><td class="p-2.5">38.0</td><td class="p-2.5 font-semibold text-emerald-600">95</td><td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">Sí</span></td></tr>
                  <tr class="hover:bg-purple-50/40"><td class="p-2.5 font-mono text-gray-500">2</td><td class="p-2.5 font-medium text-gray-900">Mateo Silva</td><td class="p-2.5">Data Science</td><td class="p-2.5">15.2</td><td class="p-2.5 font-semibold text-amber-600">74</td><td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">No</span></td></tr>
                  <tr class="hover:bg-purple-50/40"><td class="p-2.5 font-mono text-gray-500">3</td><td class="p-2.5 font-medium text-gray-900">Lucia Vega</td><td class="p-2.5">Machine Learning</td><td class="p-2.5">42.1</td><td class="p-2.5 font-semibold text-emerald-600">98</td><td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">Sí</span></td></tr>
                  <tr class="hover:bg-purple-50/40"><td class="p-2.5 font-mono text-gray-500">4</td><td class="p-2.5 font-medium text-gray-900">Andrés Gómez</td><td class="p-2.5">Cloud Native</td><td class="p-2.5">29.8</td><td class="p-2.5 font-semibold text-emerald-600">86</td><td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">Sí</span></td></tr>
                </tbody>
              </table>`,
            ],
          },
        },
      ],
      metadata: {},
    },
    {
      id: 'cell-pd-2',
      cell_type: 'markdown',
      source: [
        '### 📊 Agrupaciones y Estadísticas Descriptivas\n',
        'Podemos usar `.groupby()` para encontrar el rendimiento por categoría de curso:',
      ],
      metadata: {},
    },
    {
      id: 'cell-pd-code-2',
      cell_type: 'code',
      execution_count: 2,
      source: [
        '# Resumen agrupado por curso\n',
        'resumen = df.groupby("Curso")[["Horas_Estudio", "Nota_Final"]].mean().round(1)\n',
        'print(resumen)',
      ],
      outputs: [
        {
          output_type: 'stream',
          name: 'stdout',
          text: [
            '                  Horas_Estudio  Nota_Final\n',
            'Curso                                      \n',
            'Cloud Native               33.9        90.5\n',
            'Data Science               19.8        81.0\n',
            'Machine Learning           42.1        98.0\n',
          ],
        },
      ],
      metadata: {},
    },
  ],
  metadata: {
    kernelspec: {
      display_name: 'Python 3',
      language: 'python',
      name: 'python3',
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

// Notebook 3: Machine Learning & Regresión
export const notebookMachineLearning: JupyterNotebook = {
  cells: [
    {
      id: 'cell-ml-1',
      cell_type: 'markdown',
      source: [
        '# 🤖 Machine Learning: Regresión Lineal y Descenso de Gradiente\n',
        'La regresión lineal modela la relación entre una variable dependiente $Y$ y una o más variables independientes $X$.\n\n',
        '### Ecuación de la hipótesis:\n',
        '$$\\hat{y} = w \\cdot x + b$$\n\n',
        'Donde:\n',
        '- $w$ es el peso (pendiente / weight)\n',
        '- $b$ es el sesgo (bias / intercepto)\n',
        '- Calculamos la pérdida usando el Error Cuadrático Medio (MSE): $\\mathcal{L} = \\frac{1}{N} \\sum (y - \\hat{y})^2$',
      ],
      metadata: {},
    },
    {
      id: 'cell-ml-code-1',
      cell_type: 'code',
      execution_count: 1,
      source: [
        'import numpy as np\n',
        'import matplotlib.pyplot as plt\n',
        '\n',
        '# Generamos datos sintéticos con correlación positiva\n',
        'np.random.seed(42)\n',
        'X = np.linspace(2, 10, 11)\n',
        'y = 10 * X + 15 + np.random.normal(0, 3, size=len(X))\n',
        '\n',
        '# Ajuste analítico de mínimos cuadrados\n',
        'w, b = np.polyfit(X, y, 1)\n',
        'print(f"Modelo entrenado: y = {w:.2f} * x + {b:.2f}")',
      ],
      outputs: [
        {
          output_type: 'stream',
          name: 'stdout',
          text: ['Modelo entrenado: y = 9.87 * x + 15.62\n'],
        },
      ],
      metadata: {},
    },
    {
      id: 'cell-ml-code-2',
      cell_type: 'code',
      execution_count: 2,
      source: [
        '# Graficar la recta de ajuste contra los puntos experimentales\n',
        'plt.figure(figsize=(8, 4.5))\n',
        'plt.scatter(X, y, color="#281434", label="Datos reales")\n',
        'plt.plot(X, w*X + b, color="#724ae8", linewidth=2.5, label="Regresión ajustada")\n',
        'plt.title("Ajuste de Regresión Lineal")\n',
        'plt.xlabel("Horas de estudio")\n',
        'plt.ylabel("Nota obtenida")\n',
        'plt.grid(True, alpha=0.3)\n',
        'plt.show()',
      ],
      outputs: [
        {
          output_type: 'display_data',
          data: {
            'image/svg+xml': scatterPlotSvg,
          },
        },
      ],
      metadata: {},
    },
    {
      id: 'cell-ml-md-2',
      cell_type: 'markdown',
      source: [
        '### 📉 Convergencia de la Pérdida (Loss Function)\n',
        'A medida que el algoritmo itera a través de las épocas, la penalización se reduce exponencialmente hasta estabilizarse en el mínimo local.',
      ],
      metadata: {},
    },
    {
      id: 'cell-ml-code-3',
      cell_type: 'code',
      execution_count: 3,
      source: [
        '# Visualización de la curva de pérdida durante 100 épocas\n',
        'epocas = np.arange(1, 101)\n',
        'loss = np.exp(-epocas / 18) + 0.0034\n',
        'print(f"Pérdida final en época 100: {loss[-1]:.4f}")',
      ],
      outputs: [
        {
          output_type: 'stream',
          name: 'stdout',
          text: ['Pérdida final en época 100: 0.0034\n'],
        },
        {
          output_type: 'display_data',
          data: {
            'image/svg+xml': lossCurveSvg,
          },
        },
      ],
      metadata: {},
    },
  ],
  metadata: {
    kernelspec: {
      display_name: 'Python 3',
      language: 'python',
      name: 'python3',
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

// Initial Seed Courses
export const defaultCourses: Course[] = [
  {
    id: 'course-python-ml',
    title: 'Dominando Python, Data Science y Machine Learning',
    slug: 'python-data-science-machine-learning',
    tagline: 'Aprende programación moderna, análisis de datos con Pandas y modelos de IA usando Jupyter Notebooks interactivos.',
    description: 'Un curso práctico diseñado con la estética limpia de Podia para que aprendas haciendo. Cada lección incluye notebooks interactivos (.ipynb) que puedes correr directamente en tu navegador sin instalar nada, o descargar a tu ordenador.',
    badge: 'Curso Más Popular',
    themeColor: '#724ae8',
    price: 'Gratis',
    isPublished: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-20T14:30:00Z',
    instructor: {
      name: 'David Rodriguez',
      title: 'Senior AI Engineer & Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Ingeniero de software especializado en arquitecturas serverless en Cloudflare, Inteligencia Artificial aplicada y educación tecnológica para creadores.',
    },
    features: [
      'Compatibilidad nativa con archivos de Jupyter Notebook (.ipynb)',
      'Ejecución de código Python en el navegador con WebAssembly (Pyodide)',
      'Alojamiento 100% gratuito en Cloudflare Pages con CDN global',
      'Diseño elegante y minimalista inspirado en Podia',
      'Descarga de notebooks y recursos de cada clase con un clic',
      'Seguimiento automático del progreso del estudiante y notas privadas',
    ],
    faq: [
      {
        question: '¿Realmente se puede alojar 100% gratis en Cloudflare?',
        answer: 'Sí. Cloudflare Pages ofrece un nivel gratuito perpetuo con ancho de banda ilimitado, certificado SSL gratis, 500 compilaciones al mes y distribución en más de 300 ciudades del mundo. Además, Cloudflare D1 ofrece hasta 5 millones de lecturas diarias y 5GB de almacenamiento SQLite completamente gratis.',
      },
      {
        question: '¿Cómo funcionan los archivos de Jupyter Notebook (.ipynb)?',
        answer: 'Nuestra plataforma parsea directamente los archivos estándar .ipynb generados por JupyterLab, Google Colab o VS Code. Renderiza celdas de Markdown, bloques de código coloreados y resultados complejos como tablas HTML (Pandas) e imágenes vectoriales (Matplotlib). También puedes subir tus propios notebooks desde el panel de creador.',
      },
      {
        question: '¿Puedo ejecutar código Python sin tener Python instalado?',
        answer: '¡Sí! Integramos Pyodide (Python compilado a WebAssembly). Al pulsar "Ejecutar código", el script corre dentro de la memoria de tu navegador de manera instantánea y segura.',
      },
    ],
    sections: [
      {
        id: 'sec-1',
        title: 'Módulo 1: Fundamentos y Sintaxis Python Moderna',
        description: 'Bases de la programación en Python y estructura de notebooks.',
        lessons: [
          {
            id: 'les-1',
            title: '1. Introducción a Python y Jupyter Notebooks',
            slug: 'intro-python-jupyter-notebooks',
            type: 'notebook',
            durationMinutes: 15,
            summary: 'Aprende los conceptos fundamentales de Python, tipos de variables y list comprehensions con ejecución interactiva.',
            notebookData: notebookIntroPython,
            notebookFileName: '01_intro_python.ipynb',
            resources: [
              { name: '01_intro_python.ipynb', url: '#', size: '12 KB' },
              { name: 'Guia_Atajos_Jupyter.pdf', url: '#', size: '1.2 MB' },
            ],
          },
          {
            id: 'les-2',
            title: '2. Buenas prácticas y Tipado estático en Python',
            slug: 'buenas-practicas-tipado',
            type: 'article',
            durationMinutes: 10,
            summary: 'Escribe código limpio, mantenible y legible con Type Hints y dataclasses.',
            contentMarkdown: `# 🎯 Buenas Prácticas y Tipado Estático en Python Moderno

Escribir código legible y robusto es indispensable cuando construyes aplicaciones en producción o pipelines de ciencia de datos.

### 1. Usa Type Hints siempre que sea posible
Desde Python 3.5+, las sugerencias de tipos mejoran la documentación viva de tu código y evitan errores sutiles:

\`\`\`python
def procesar_calificacion(nombre: str, puntuacion: float) -> str:
    if puntuacion >= 90:
        return f"{nombre} ha obtenido calificación de Honor"
    elif puntuacion >= 70:
        return f"{nombre} ha aprobado satisfactoriamente"
    return f"{nombre} debe presentar recuperación"
\`\`\`

### 2. Estructuras de datos con dataclasses
En lugar de diccionarios planos o clases con constructores verbosos, utiliza \`@dataclass\`:

\`\`\`python
from dataclasses import dataclass

@dataclass
class Alumno:
    id: int
    nombre: str
    email: str
    cursos_inscritos: list[str]

    def total_cursos(self) -> int:
        return len(self.cursos_inscritos)
\`\`\`

> 💡 **Consejo Podia:** Mantén tus lecciones concisas y enfocadas en un solo concepto a la vez para maximizar la retención de los estudiantes.
`,
          },
        ],
      },
      {
        id: 'sec-2',
        title: 'Módulo 2: Manipulación y Visualización de Datos',
        description: 'Aprende a transformar tablas de datos y crear gráficos visuales atractivos.',
        lessons: [
          {
            id: 'les-3',
            title: '3. DataFrames con Pandas y Tablas Interactivas',
            slug: 'pandas-dataframes-analisis',
            type: 'notebook',
            durationMinutes: 20,
            summary: 'Filtrado, agregación de columnas, limpieza y presentación de datos tabulares con Pandas.',
            notebookData: notebookPandasAnalysis,
            notebookFileName: '02_pandas_dataframes.ipynb',
            resources: [
              { name: '02_pandas_dataframes.ipynb', url: '#', size: '18 KB' },
              { name: 'dataset_estudiantes.csv', url: '#', size: '4.5 KB' },
            ],
          },
          {
            id: 'les-4',
            title: '4. Regresión Lineal y Gráficos de Aprendizaje',
            slug: 'machine-learning-regresion-lineal',
            type: 'notebook',
            durationMinutes: 25,
            summary: 'Implementación del algoritmo de regresión lineal, minimización de error cuadrático medio y visualización con Matplotlib.',
            notebookData: notebookMachineLearning,
            notebookFileName: '03_machine_learning_regresion.ipynb',
            resources: [
              { name: '03_machine_learning_regresion.ipynb', url: '#', size: '24 KB' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'course-cloudflare-fullstack',
    title: 'Arquitectura Serverless 100% Gratis en Cloudflare',
    slug: 'arquitectura-serverless-gratis-cloudflare',
    tagline: 'Aprende a desplegar LMS, APIs, Bases de Datos D1 y almacenamiento R2 con coste cero para siempre.',
    description: 'Guía paso a paso para arquitectos y creadores que quieren lanzar plataformas web globales sin pagar facturas de hosting ni infraestructura.',
    badge: 'Nuevo',
    themeColor: '#f97316',
    price: 'Gratis',
    isPublished: true,
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-03-22T09:15:00Z',
    instructor: {
      name: 'David Rodriguez',
      title: 'Senior AI Engineer & Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      bio: 'Especialista en desarrollo cloud-native con Cloudflare Workers, Pages, D1 y modelos de lenguaje locales.',
    },
    features: [
      'Cloudflare Pages: Alojamiento estático gratuito con SSL y dominios personalizados',
      'Cloudflare D1: Base de datos SQL serverless con 5 millones de lecturas diarias gratis',
      'Cloudflare R2: Almacenamiento de objetos S3 sin costes de salida de datos',
      'Despliegues automáticos desde repositorios de GitHub con Git push',
    ],
    faq: [
      {
        question: '¿Por qué Cloudflare ofrece estos servicios gratis?',
        answer: 'Cloudflare utiliza su red global existente para procesar tráfico en el borde (edge network). El tier gratuito está pensado para desarrolladores y proyectos pequeños/medianos, con generosos límites que superan con creces a la competencia.',
      },
    ],
    sections: [
      {
        id: 'cf-sec-1',
        title: 'Módulo 1: Despliegue de este LMS en Cloudflare Pages',
        description: 'Cómo poner en marcha este mismo proyecto en tu propia cuenta en menos de 3 minutos.',
        lessons: [
          {
            id: 'cf-les-1',
            title: '1. Despliegue en 3 minutos con Wrangler CLI y GitHub',
            slug: 'despliegue-cloudflare-pages-gratis',
            type: 'article',
            durationMinutes: 12,
            summary: 'Instrucciones exactas para clonar el repositorio, compilar y publicar en Cloudflare sin tarjeta de crédito.',
            contentMarkdown: `# 🚀 Despliegue de tu LMS en Cloudflare Pages 100% Gratis

¡Felicidades! Este clon de LMS inspirado en Podia está listo para funcionar de manera completamente gratuita en la nube de Cloudflare.

---

### Opción A: Despliegue instantáneo con Wrangler CLI (Línea de Comandos)

1. **Compila la aplicación:**
\`\`\`bash
npm run build
\`\`\`

2. **Inicia sesión en Cloudflare (gratis, si no lo has hecho):**
\`\`\`bash
npx wrangler login
\`\`\`

3. **Publica en Cloudflare Pages:**
\`\`\`bash
npx wrangler pages deploy dist --project-name mi-lms-podia
\`\`\`

¡Listo! Recibirás inmediatamente una URL pública segura como \`https://mi-lms-podia.pages.dev\` con certificado SSL activado y CDN mundial.

---

### Opción B: Integración Continua con GitHub (Recomendado)

1. Sube tu código a un repositorio en **GitHub**.
2. Entra en el panel de **Cloudflare Dashboard** -> **Workers & Pages** -> **Create Application** -> **Pages**.
3. Selecciona **Connect to Git** y escoge tu repositorio.
4. Configura los parámetros de build:
   - **Framework preset:** \`Vite\`
   - **Build command:** \`npm run build\`
   - **Build output directory:** \`dist\`
5. Haz clic en **Save and Deploy**.

A partir de ese momento, cada vez que hagas \`git push\`, Cloudflare actualizará tu LMS automáticamente de forma gratuita.

---

### ¿Quieres base de datos Cloudflare D1 (SQL)?
Para habilitar Cloudflare D1 en tu Worker/Pages Functions:

\`\`\`bash
# 1. Crear la base de datos D1 gratis
npx wrangler d1 create lms-database

# 2. Aplicar el esquema SQL incluido
npx wrangler d1 execute lms-database --file=./schema.sql
\`\`\`
`,
          },
        ],
      },
    ],
  },
];
