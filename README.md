# 🎓 Aura LMS · Plataforma de Formación Privada con Jupyter Notebooks en Cloudflare

Plataforma LMS moderna, minimalista y completamente privada, diseñada para alojarse **100% gratis en Cloudflare Pages**, con control de acceso por correo y contraseña, gestión de alumnos, módulos multimedia (vídeo, fotos, audio, código, tests) y edición completa de la portada.

---

## ✨ Características Principales

- 🔐 **Control de Acceso Cerrado:** Los alumnos solo pueden ingresar si el profesor los ha dado de alta previamente con su correo electrónico y contraseña.
- 🧑‍🏫 **Panel de Profesor:**
  - Gestión de alumnos: alta por correo, asignación de cursos, cambio de estado (activo/pausado) y eliminación.
  - Diseñador de cursos: creación visual de módulos temáticos y lecciones.
  - **Editor de Portada (Home):** Modificación del título, subtítulo, botón de acción y beneficios principales en vivo.
- 🎬 **6 Módulos de Contenido Multimedia:**
  - **Vídeo HD:** Compatible con YouTube, Vimeo y MP4 directo.
  - **Infografía / Foto:** Visor con herramienta de zoom interactivo y pie explicativo.
  - **Audio / Podcast:** Reproductor con barra de avance, volumen y notas del episodio.
  - **Código Interactivo (.ipynb):** Soporte nativo de Jupyter Notebooks con ejecución Python en el navegador vía WebAssembly (Pyodide).
  - **Guía de Estudio (Markdown):** Textos teóricos con fórmulas matemáticas y bloques de código.
  - **Cuestionario Test (Quiz):** Evaluaciones autocorregibles con retroalimentación instantánea.
- ☁️ **Descargas Cloud Integradas:**
  - Soporte para enlaces de **Google Drive**, **Dropbox** y archivos locales adjuntos.
- 🌐 **100% Gratuito en Cloudflare:**
  - Listo para desplegar en **Cloudflare Pages** (ancho de banda ilimitado y SSL gratis).
  - Base de datos serverless **Cloudflare D1 SQL** (5 millones de lecturas diarias gratis).

---

## 🔑 Credenciales de Acceso

- 👨‍🎓 **Alumno:**
  - Usuario: `david` o `davidmeirino@gmail.com`
  - Contraseña: `18111982z`
- 🧑‍🏫 **Profesor:**
  - Usuario: `profe`
  - Contraseña: `18111982z`

---

## 🚀 Inicio Rápido en Local

```bash
npm install
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

## 🌐 Despliegue en Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name aura-lms
```
