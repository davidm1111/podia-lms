# 🎓 Podia LMS · Clon 100% Gratuito en Cloudflare con Soporte de Jupyter Notebooks

Un clon moderno y minimalista de la plataforma de cursos **Podia**, diseñado para instalarse y alojarse **completamente gratis en Cloudflare Pages**, con soporte nativo de archivos **Jupyter Notebook (`.ipynb`)** y ejecución de Python en el navegador con WebAssembly.

---

## ✨ Características Principales

- 🎨 **Estética Podia:** Paleta de colores cálida y profesional (ciruela/aubergine `#281434`, lavanda `#724ae8`, fondos crema `#faf8f5`), tipografía humana y diseño limpio enfocado en la lectura.
- 📓 **Soporte Nativo de Jupyter Notebooks (.ipynb):**
  - Celdas de Markdown enriquecidas (títulos, listas, fórmulas matemáticas, citas, formato).
  - Celdas de código con sintaxis coloreada para Python, indicador `In [x]`, botón de copiar y edición en vivo.
  - Renderizado de salidas complejas: tablas interactivas de **Pandas DataFrames**, gráficos vectoriales y PNG de **Matplotlib/Seaborn**, y streams de salida de consola.
  - **Ejecución de Python en el navegador** vía **Pyodide (WebAssembly)**: los estudiantes pueden correr código real sin instalar Python ni pagar servidores.
  - Descarga del archivo `.ipynb` original con un solo clic.
- ☁️ **100% Gratuito en Cloudflare:**
  - Listo para desplegar en **Cloudflare Pages** (ancho de banda ilimitado y SSL gratis).
  - Compatible con base de datos SQL **Cloudflare D1** (5 millones de lecturas/día gratis).
  - Configurado con `wrangler.jsonc`, `schema.sql` y Pages Functions.
- 🧑‍🏫 **Estudio de Creador:**
  - Creación y edición visual de cursos, módulos y lecciones.
  - Subida directa de archivos `.ipynb` con análisis de celdas por arrastrar y soltar.
  - Alternador instantáneo entre *Modo Estudiante* y *Modo Creador*.
- 🎓 **Experiencia de Aprendizaje:**
  - Barra lateral de progreso con checklist y medidor de porcentaje.
  - Botón "Completar y continuar" con explosión de confeti al terminar el curso.
  - Notas privadas del estudiante que se guardan solas por lección.
  - Tablón de comentarios y preguntas en cada clase.

---

## 🚀 Inicio Rápido en Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## 🌐 Despliegue en Cloudflare Pages

### Con Wrangler CLI (30 segundos):
```bash
npm run build
npx wrangler pages deploy dist --project-name podia-lms
```

Para ver la guía completa paso a paso con GitHub y Cloudflare D1, consulta [DEPLOY_CLOUDFLARE.md](file:///c:/Users/David/Documents/APPS%20IA/App%20clon%20LMS/DEPLOY_CLOUDFLARE.md).

---

## 📂 Estructura del Proyecto

```
├── DEPLOY_CLOUDFLARE.md        # Guía completa de despliegue a coste $0
├── schema.sql                  # Esquema SQL para Cloudflare D1
├── wrangler.jsonc              # Configuración de Cloudflare Pages & D1
├── functions/                  # Cloudflare Pages Functions (API REST)
│   └── api/[[route]].ts
└── src/
    ├── types/index.ts          # Tipos para Cursos, Lecciones y Jupyter Notebooks
    ├── lib/
    │   ├── notebookParser.ts   # Parser de archivos .ipynb (celdas, tablas, gráficos)
    │   ├── pyodideRunner.ts    # Motor de ejecución Python WebAssembly
    │   ├── syntaxHighlight.ts  # Resaltador de sintaxis para código
    │   └── storage.ts          # Persistencia local y sincronización
    ├── data/
    │   └── sampleCourses.ts    # Cursos de ejemplo pre-cargados con notebooks
    └── components/
        ├── Navbar.tsx          # Barra de navegación con estética Podia
        ├── CloudflareDeployModal.tsx # Modal con comandos de despliegue
        ├── MarkdownView.tsx    # Renderizador de contenido Markdown
        ├── Notebook/           # Visor de celdas y ejecución de Notebooks
        ├── CoursePlayer/       # Aula virtual, sidebar, notas y confeti
        ├── CourseCreator/      # Panel para profesores y subida de .ipynb
        └── Storefront/         # Catálogo de cursos y landing page de ventas
```
