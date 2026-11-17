# MapCoords - Mapa Interactivo (Vue 3 + Vite + Leaflet + Supabase)

Aplicación web interactiva para crear, filtrar y compartir puntos de interés sobre el mapa de un videojuego, con diseño *Glassmorphism* adaptado para **móvil y PC**.

---

## 🚀 Guía de Configuración de Supabase y Deploy en Vercel

### 1. Crear la tabla en Supabase (Plan Gratuito)
1. Crea un proyecto gratuito en [supabase.com](https://supabase.com/).
2. Entra a **SQL Editor** en el menú izquierdo de Supabase.
3. Copia todo el contenido de [`supabase/schema.sql`](./supabase/schema.sql), pégalo en el editor y presiona **Run**.

### 2. Configurar Variables de Entorno en Local (`.env`)
1. En la raíz del proyecto, crea un archivo llamado **`.env`** (puedes guiarte de [`.env.example`](./.env.example)).
2. En tu panel de Supabase ve a **Project Settings → API / Data API** y copia tu **Project URL** y tu **anon public key**.
3. Pégalos en tu archivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://tu-id-de-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Ejecuta `npm run dev`. Verás que el indicador en la esquina superior derecha cambia a **`Supabase Sync`** (punto verde).

> **Nota sobre el plan gratuito de Supabase:** Incluye 500 MB de base de datos (suficiente para cientos de miles de marcadores). Si nadie abre la app durante 7 días seguidos, Supabase pausa el proyecto por inactividad; puedes reactivarlo con un clic desde el panel de Supabase sin perder datos.

---

### 3. Hacer Deploy en Vercel (Plan Gratuito / Hobby)
1. Sube tus cambios a tu repositorio en GitHub (`git push origin master`).
2. Entra a [vercel.com](https://vercel.com/) e importa tu repositorio `mapcoords-gta`.
3. Vercel detectará automáticamente que el framework es **Vite** (`Build Command: vite build`, `Output Directory: dist`).
4. Abre la sección **Environment Variables** antes de desplegar y agrega las dos variables:
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
5. Haz clic en **Deploy**.

---

## 🗺️ Cómo cambiar la imagen del mapa en el futuro

1. Coloca tu nueva imagen (`.jpg`, `.png` o `.webp`) dentro de la carpeta `public/maps/`.
2. Abre [`src/config/mapConfig.js`](./src/config/mapConfig.js) y actualiza las 3 constantes al inicio del archivo con las dimensiones en píxeles de tu nueva imagen:
   ```js
   export const MAP_IMAGE_WIDTH = 5944
   export const MAP_IMAGE_HEIGHT = 8075
   export const MAP_IMAGE_URL = '/maps/5map.jpg'
   ```
