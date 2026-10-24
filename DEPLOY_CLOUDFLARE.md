# 🚀 Guía de Instalación Gratuita en Cloudflare (Coste $0 para siempre)

Este LMS privado con soporte nativo de **Jupyter Notebooks (.ipynb)** ha sido concebido para funcionar al 100% en la capa gratuita de **Cloudflare**.

---

## 💎 ¿Por qué es 100% Gratuito?

- **Cloudflare Pages:** Ancho de banda ilimitado, certificados SSL automáticos gratis, dominios personalizados sin coste, y 500 despliegues al mes.
- **Cloudflare D1 (SQL Serverless):** 5 millones de lecturas diarias, 100.000 escrituras diarias y 5 GB de almacenamiento SQLite gratuito.
- **WebAssembly (Pyodide):** El código Python de los notebooks se ejecuta en el navegador del estudiante, por lo que **no requieres servidores dedicados caros** para ejecutar Python.

---

## ⚡ Despliegue con Wrangler CLI

```bash
# 1. Compilar la aplicación
npm run build

# 2. Iniciar sesión en Cloudflare (cuenta gratuita)
npx wrangler login

# 3. Publicar en Cloudflare Pages
npx wrangler pages deploy dist --project-name aura-lms
```

---

## 🗄️ Base de Datos Cloudflare D1 (SQL Gratuita)

```bash
# 1. Crear base de datos D1
npx wrangler d1 create lms-database

# 2. Aplicar el esquema SQL
npx wrangler d1 execute lms-database --file=./schema.sql --remote
```
