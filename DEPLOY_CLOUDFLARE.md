# 🚀 Guía de Instalación Gratuita en Cloudflare (Coste $0 para siempre)

Este LMS inspirado en **Podia** con soporte nativo de **Jupyter Notebooks (.ipynb)** ha sido concebido para funcionar al 100% en la capa gratuita de **Cloudflare**.

---

## 💎 ¿Por qué es 100% Gratuito?

Cloudflare ofrece una de las capas gratuitas más generosas del mundo para desarrolladores y educadores:
- **Cloudflare Pages:** Ancho de banda ilimitado, certificados SSL automáticos gratis, dominios personalizados sin coste, y 500 despliegues al mes.
- **Cloudflare D1 (SQL Serverless):** 5 millones de lecturas diarias, 100.000 escrituras diarias y 5 GB de almacenamiento SQLite gratuito.
- **WebAssembly (Pyodide):** El código Python de los notebooks se ejecuta en el navegador del estudiante, por lo que **no requieres servidores dedicados caros** para ejecutar Python.

---

## 🛠️ Método 1: Despliegue con Git (Recomendado y más fácil)

Este método te permite actualizar tu LMS simplemente haciendo `git push`.

1. **Crea un repositorio en GitHub:**
   - Sube esta carpeta a tu cuenta de GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Podia LMS"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

2. **Conecta GitHub con Cloudflare Pages:**
   - Entra en tu cuenta de [Cloudflare Dashboard](https://dash.cloudflare.com).
   - En el menú lateral, ve a **Compute (Workers & Pages)** -> **Overview** -> **Create application** -> **Pages** -> **Connect to Git**.
   - Selecciona tu repositorio de GitHub.

3. **Configura las opciones de compilación:**
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`

4. **Haz clic en "Save and Deploy":**
   - En menos de 60 segundos tu LMS estará publicado y disponible en una URL como:
     `https://tu-proyecto.pages.dev`
   - Puedes asociar tu propio dominio (ej. `academia.com` o `cursos.com`) de forma 100% gratuita.

---

## ⚡ Método 2: Despliegue Directo con Wrangler CLI (Línea de comandos)

Si prefieres desplegar directamente desde tu terminal sin pasar por GitHub:

1. **Compila la aplicación:**
   ```bash
   npm run build
   ```

2. **Inicia sesión en Cloudflare:**
   ```bash
   npx wrangler login
   ```
   *(Se abrirá una ventana en tu navegador para autorizar la conexión gratuita).*

3. **Publica en Cloudflare Pages:**
   ```bash
   npx wrangler pages deploy dist --project-name mi-podia-lms
   ```

4. **¡Listo!** La terminal te mostrará tu enlace público listo para compartir con tus alumnos.

---

## 🗄️ (Opcional) Activar Base de Datos Cloudflare D1 (SQL Gratuita)

La aplicación funciona inmediatamente sin bases de datos (usando almacenamiento local instantáneo en el navegador). Si deseas almacenar los cursos y progresos de los estudiantes en la nube en Cloudflare D1:

1. **Crea la base de datos D1:**
   ```bash
   npx wrangler d1 create lms-database
   ```
   *Copia el `database_id` que te devuelve la terminal.*

2. **Pega el `database_id` en `wrangler.jsonc`:**
   ```json
   "database_id": "TU_ID_AQUI"
   ```

3. **Aplica el esquema SQL:**
   ```bash
   npx wrangler d1 execute lms-database --file=./schema.sql
   ```

4. **Vincula la base de datos a tu proyecto de Pages:**
   - En el panel de Cloudflare: **Workers & Pages** -> Selecciona tu proyecto -> **Settings** -> **Bindings** -> **Add binding** -> **D1 database** -> Nombre de variable: `DB` -> Selecciona `lms-database`.

---

## 📓 Cómo Usar los Jupyter Notebooks (.ipynb)

1. **Modo Estudiante:**
   - Entra a cualquier lección marcada con `.ipynb`.
   - Lee el texto formateado, las fórmulas matemáticas y los análisis.
   - Pulsa **"Ejecutar celda"** para correr código Python en tiempo real.
   - Haz clic en **"Descargar .ipynb"** para guardarlo en tu ordenador.

2. **Modo Creador / Profesor:**
   - Haz clic en **"Estudio de Creador"** en la barra superior.
   - En cualquier módulo, pulsa **"Añadir Lección"** y selecciona **"Jupyter Notebook (.ipynb)"**.
   - Arrastra tu archivo `.ipynb` generado con JupyterLab, Google Colab o VS Code.
   - El sistema extraerá automáticamente las celdas, los gráficos de Matplotlib y las tablas de Pandas para tus alumnos.
