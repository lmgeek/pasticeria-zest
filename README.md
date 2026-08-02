# Zest Pasticceria — Next.js (App Router)

> Proyecto full-stack unificado en **Next.js 15** con App Router.  
> No más Vite + Express separados — frontend y backend conviven en el mismo proyecto.

## Stack

| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Frontend** | React 19, Zustand, i18next, Three.js, Stripe Elements |
| **Backend** | Next.js API Routes (equivalente a Express) |
| **DB** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs + Google OAuth |
| **Pagos** | Stripe (Payment Intents + Webhooks) |

## Quick Start

```bash
# 1. MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7

# 2. Config
cp .env.local.example .env.local

# 3. Instalar
npm install

# 4. Semilla inicial
npm run seed

# 5. Iniciar
npm run dev
```

- **Frontend + API**: `http://localhost:3000`
- **Admin**: `http://localhost:3000/admin` (login: `luismarin@usa.com` / `LuisMarin.123`)
- **Shop**: `http://localhost:3000/menu`
- **Checkout**: `http://localhost:3000/checkout`

---

## Plan de Desarrollo Original (migrado a Next.js)

## Fase 1 — Setup Backend (Next.js API Routes)

- [x] Crear `server/` con `package.json`
- [x] Dependencias: `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `passport`, `passport-local`, `passport-google-oauth20`, `stripe`, `cors`, `dotenv`, `express-validator`
- [x] `server/index.js` — entry point Express
- [x] `server/config/db.js` — conexión MongoDB
- [x] `server/config/passport.js` — estrategias Local + Google
- [x] `server/config/stripe.js` — cliente Stripe
- [x] `server/middleware/auth.js` — verificar JWT
- [x] `server/middleware/rbac.js` — control de roles
- [x] `.env`: `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `PORT`

## Fase 2 — Modelos MongoDB

- [x] `server/models/User.js` — email, password, nome, rol (admin/staff/cliente), googleId, avatar, attivo
- [x] `server/models/Category.js` — nome, slug, descrizione, ordine, attivo
- [x] `server/models/Product.js` — nome, slug, descrizione, prezzo, categoria (ref), immagine, attivo, disponibile
- [x] `server/models/Client.js` — nome, email, telefono, indirizzo, userId (ref), note
- [x] `server/models/Sale.js` — cliente (ref), items[], totale, stato (pendente/pagato/cancellato), stripePaymentIntentId
- [x] `server/models/SaleItem.js` — prodotto (ref), nome, quantita, prezzoUnitario, subtotale
- [x] `server/models/StoreConfig.js` — chiave (unique), valore
- [x] `server/seed.js` — datos iniciales (admin user, categorías, config default)

## Fase 3 — Autenticación (JWT + Local + Google OAuth)

- [x] `POST /api/auth/register` — registro email+password
- [x] `POST /api/auth/login` — login → JWT
- [x] `GET /api/auth/google` — redirect Google OAuth
- [x] `GET /api/auth/google/callback` — callback → JWT
- [x] `GET /api/auth/me` — perfil usuario autenticado

## Fase 4 — API REST (CRUD Completo)

- [x] `routes/products.js` — GET (público), POST/PUT/DELETE (admin/staff)
- [x] `routes/categories.js` — GET, POST, PUT, DELETE
- [x] `routes/clients.js` — GET (con búsqueda + historial compras), POST, PUT
- [x] `routes/sales.js` — GET (con filtros), GET/:id, PUT/:id/status
- [x] `routes/users.js` (solo admin) — GET, PUT/:id, DELETE/:id
- [x] `routes/config.js` (solo admin) — GET, PUT, GET/public
- [x] `routes/checkout.js` — POST create-payment-intent, POST webhook

## Fase 5 — Frontend: Router + Layouts + Navbar Híbrido

> Usar `/frontend-design` para Navbar, layouts y componentes de layout.

- [x] Instalar: `react-router-dom`, `zustand`, `axios`, `i18next`, `react-i18next`, `@stripe/react-stripe-js`, `@stripe/stripe-js`
- [x] `src/main.jsx` → `<BrowserRouter>`
- [x] `src/Routes.jsx` con todas las rutas
- [x] `PublicLayout.jsx` — Navbar + <Outlet /> + Footer
- [x] `AdminLayout.jsx` — Sidebar + Topbar + <Outlet />
- [x] `ProtectedRoute.jsx` — verifica JWT + rol
- [x] **Navbar.jsx** adaptado con navegación híbrida (React Router + scroll anchors)
- [x] `services/api.js` — axios con interceptor JWT

## Fase 6 — Migrar Home + Componentes Actuales

- [x] App.jsx actual → `pages/Home.jsx`
- [x] `useEffect` en Home escucha `location.hash` y hace scroll automático
- [x] **Menu.jsx**: agregar botón "Vedi il nostro shop completo →" enlazando a `/menu`

## Fase 7 — Internacionalización (i18n)

- [x] `i18n/index.js` — i18next con fallback a `it`, persistencia en localStorage
- [x] `i18n/it.json` — italiano (default)
- [x] `i18n/es.json` — español
- [x] `i18n/en.json` — inglés
- [x] `LanguageSwitcher.jsx` — selector visual en footer + admin

## Fase 8 — Admin UI: Dashboard + Componentes Base

> Usar `/frontend-design` para todos los componentes de admin.

- [x] `styles/admin.css` — sidebar, tablas, formularios, cards responsive
- [x] `admin/DataTable.jsx` — tabla configurable con búsqueda + paginación
- [x] `admin/ModalForm.jsx` — modal con formulario dinámico
- [x] `admin/FormField.jsx` — inputs, selects, switches con validación
- [x] `admin/Dashboard.jsx` — cards de stats + últimas ventas conectado a API

## Fase 9 — Admin: ABM Productos + Categorías

> Usar `/frontend-design`.

- [x] `admin/Productos.jsx` — DataTable + ModalForm (nombre, precio, categoría, imagen, estado) conectado a API
- [x] `admin/Categorias.jsx` — DataTable + ModalForm (nombre, slug, orden) conectado a API

## Fase 10 — Admin: ABM Clientes + Ventas

> Usar `/frontend-design`.

- [x] `admin/Clientes.jsx` — DataTable + ModalForm + historial compras expandible desde API
- [x] `admin/Ventas.jsx` — DataTable con filtros de estado + detalle items + cambio estado

## Fase 11 — Admin: Usuarios + Configuración

> Usar `/frontend-design`.

- [x] `admin/Usuarios.jsx` (solo admin) — DataTable + editar rol/estado + eliminar
- [x] `admin/Configuracion.jsx` — Stripe (con guía paso a paso), idioma, datos negocio, stripe keys

## Fase 12 — Ecommerce: Página /menu

> Usar `/frontend-design`.

- [x] `styles/ecommerce.css`
- [x] `pages/MenuEcommerce.jsx` — catálogo con filtro por categoría, ordenar por precio/nombre
- [x] `components/ProductCard.jsx` — imagen, nombre, descripción, precio, botón "Aggiungi al Carrello"

## Fase 13 — Carrito de Compras (Zustand)

> Usar `/frontend-design` para CartDrawer.

- [x] `stores/cartStore.js` — items[], addItem, removeItem, updateQuantity, clear, total, count (persist localStorage)
- [x] `components/CartDrawer.jsx` — panel lateral con items, total, botón "Procedi al Pagamento"
- [x] Icono carrito en Navbar con badge de cantidad

## Fase 14 — Stripe Checkout + Webhook

> Usar `/frontend-design` para Checkout y Success pages.

- [x] `services/stripe.js` — inicializar Stripe con publishable key desde API config
- [x] `pages/Checkout.jsx` — resumen pedido + Stripe Elements + botón de pago
- [x] `pages/Success.jsx` — confirmación + ID transacción (payment_intent)
- [x] Backend: `POST create-payment-intent` — calcula total, crea PaymentIntent, guarda Sale (Fase 4)
- [x] Backend: `POST webhook` — escucha `payment_intent.succeeded`, actualiza Sale (Fase 4)

## Fase 15 — Botón "Shop Completo" en Menu Section

- [x] Editar `Menu.jsx` con link a `/menu` (Fase 6)

## Fase 16 — Docker + Deploy + Documentación

- [x] `server/Dockerfile` — backend Node.js
- [x] `docker-compose.yml` — mongodb + backend + frontend
- [x] `.env.example` con todas las variables (incluye STRIPE_WEBHOOK_SECRET)
- [x] README con guías paso a paso para no-programadores

---

## Desarrollo Local — Un solo comando

```bash
# 1. Asegúrate de tener MongoDB corriendo (local o Docker):
docker run -d -p 27017:27017 --name mongo mongo:7

# 2. Copia y configura el .env:
cp server/.env.example server/.env

# 3. Instala dependencias de frontend y backend:
npm install && cd server && npm install && cd ..

# 4. Si es la primera vez, siembra los datos iniciales:
cd server && npm run seed && cd ..

# 5. ¡Levanta todo con un solo comando!
npm run dev
```

Esto inicia simultáneamente:
- **Frontend** (Vite) → `http://localhost:5173`
- **Backend** (Express) → `http://localhost:5000`

> El frontend tiene un proxy configurado que redirige `/api/*` al backend, así que solo necesitas abrir `http://localhost:5173`.

---

## Guía de Despliegue en Dokploy (para no-programadores)

> La app es un único proyecto Next.js (frontend + API + webhooks). En Dokploy se despliega **un solo contenedor** con el `Dockerfile` de la raíz (build multi-stage + salida `standalone`), más un contenedor de MongoDB.

### 0. Requisitos

- Una cuenta en **Dokploy** (o cualquier VPS con Docker)
- Una cuenta en **Stripe** (gratis, para cobros)
- (Opcional) Una cuenta en **Google Cloud Console** para el login con Google

### 1. Crear cuenta Stripe y obtener claves

1. Ve a [stripe.com](https://dashboard.stripe.com/register) y regístrate
2. Una vez dentro, ve a **Developers → API Keys** en el menú lateral
3. Copia la **Publishable key** (empieza con `pk_live_` o `pk_test_`)
4. Copia la **Secret key** (empieza con `sk_live_` o `sk_test_`)

### 2. Crear el contenedor de MongoDB en Dokploy

1. En Dokploy, crea un nuevo contenedor con la imagen `mongo:7`
2. Asígnale un nombre (ej: `zest-mongodb`)
3. Agrega un volumen persistente en `/data/db` para que los datos no se pierdan
4. Anota la URI de conexión interna:
   - Desde otro contenedor en Dokploy: `mongodb://zest-mongodb:27017/zest-pasticceria`

### 3. Desplegar la app (Next.js)

1. En Dokploy, crea una nueva **Aplicación Dockerfile** y conecta este repositorio de GitHub
2. Dokploy usará el `Dockerfile` de la raíz automáticamente (puerto interno `3000`)
3. Configura las **variables de entorno** (deben incluir `NEXT_PUBLIC_URL`, que se inyecta en el build):

| Variable | Valor |
|----------|-------|
| `MONGODB_URI` | `mongodb://zest-mongodb:27017/zest-pasticceria` |
| `JWT_SECRET` | Una clave secreta larga y aleatoria |
| `STRIPE_SECRET_KEY` | La `sk_live_...` / `sk_test_...` que copiaste de Stripe |
| `STRIPE_PUBLISHABLE_KEY` | La `pk_live_...` / `pk_test_...` de Stripe |
| `STRIPE_WEBHOOK_SECRET` | El `whsec_...` del webhook (paso 4) |
| `NEXT_PUBLIC_URL` | `https://tudominio.com` (tu dominio real) |
| `SMTP_HOST` | ej. `smtp.resend.com` (o el de tu proveedor) |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | Usuario del SMTP |
| `SMTP_PASS` | Contraseña del SMTP |
| `SMTP_SECURE` | `true` |
| `STORE_EMAIL` | Remitente, ej. `hello@zestpasticceria.com` |
| `GOOGLE_CLIENT_ID` | *(opcional)* Login con Google |
| `GOOGLE_CLIENT_SECRET` | *(opcional)* Login con Google |

> El `nginx.conf` del repositorio es una plantilla del proxy reverso (gzip + caché estáticos + websockets). Si usas el proxy integrado de Dokploy no lo necesitas; puedes pegar la plantilla en **Ajustes → Nginx** del proyecto.

### 4. Configurar Webhook de Stripe

Para que Stripe notifique al servidor cuando un pago se confirme:

1. En **Stripe Dashboard → Developers → Webhooks**, crea un endpoint:
   - URL: `https://tudominio.com/api/checkout/webhook`
   - Eventos: `payment_intent.succeeded`
2. Copia el **Signing secret** (`whsec_...`) y ponlo en `STRIPE_WEBHOOK_SECRET`

### 5. Seed de datos (automático)

El seed crea el admin y los datos iniciales (es idempotente, se puede correr varias veces). **Ya no hay que ejecutarlo a mano**: se ejecuta automáticamente al arrancar el contenedor de la app (`instrumentation.js` → `lib/seed.mjs`), solo si falta algo.

Si igualmente quieres correrlo manualmente desde tu máquina contra la base de producción:

```bash
MONGODB_URI="mongodb://zest-mongodb:27017/zest-pasticceria" npm run seed
```

> Si `MONGODB_URI` usa el hostname interno de Dokploy (`zest-mongodb`), ejecútalo localmente con la IP pública del servidor (`mongodb://IP_DEL_SERVIDOR:27017/zest-pasticceria`) o desde otro contenedor dentro de la red de Dokploy.

Esto creará (o confirmará que existen):
- **Admin:** `luismarin@usa.com` / `LuisMarin.123`
- **Categorías:** Torte, Dolci, Biscotti, Bevande
- **Configuración inicial del negocio**

### 6. Ingresar al panel de administración

1. Ve a `https://tudominio.com/login`
2. Ingresa con email `luismarin@usa.com` y password `LuisMarin.123`
3. Serás redirigido al dashboard en `/admin`
4. Ve a **Configuración** para ingresar tus claves de Stripe, datos del negocio y SMTP de email

### Tarjetas de prueba Stripe

Para probar pagos en modo test usa estas tarjetas:

| Tarjeta | Resultado |
|---------|-----------|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 0002` | Rechazado (tarjeta declinada) |
| `4000 0025 0000 3155` | Requiere autenticación 3D Secure |

Cualquier fecha de expiración futura y CVC de 3 dígitos funcionan.

---

## 📦 Plantilla de Deploy Reutilizable (para próximos proyectos)

> Configuración de deploy usada en este repo, lista para copiar en futuros proyectos **Next.js + MongoDB** que se desplieguen en **Dokploy**. Patrón de referencia: [`lmgeek/nicole-trend-shop`](https://github.com/lmgeek/nicole-trend-shop).

### Arquitectura

- **Un solo contenedor** para la app (Next.js standalone, puerto interno `3000`).
- **MongoDB no va dentro del compose**: se conecta por `MONGODB_URI` (Atlas externo o un contenedor aparte en Dokploy). Así la red interna, el volumen y la URI entre servicios los resuelve Docker/Dokploy solo.
- **Admin se crea solo** en el primer arranque (`instrumentation.js` → `lib/seed.mjs`), idempotente.

### 1. `Dockerfile` (raíz)

```dockerfile
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

FROM base AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Solo si la app lee NEXT_PUBLIC_* en el build (ej: base URL de la API)
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL

RUN npm run build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir -p .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

> Requisito: `next.config.js` debe tener `output: 'standalone'`.

### 2. `docker-compose.yml` (raíz)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NEXT_TELEMETRY_DISABLED=1
        - NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}
    restart: unless-stopped
    ports:
      - "${APP_PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}
      - NEXT_TELEMETRY_DISABLED=1
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 1G
        reservations:
          cpus: "0.5"
          memory: 512M
```

> El healthcheck asume que existe una ruta `app/api/health/route.js` (puede devolver `{ status: 'ok' }`).

### 3. `nginx.conf` (proxy reverso opcional)

```nginx
upstream nextjs {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name _;

    client_max_body_size 10M;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_comp_level 6;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static/ {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /images/ {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location /api/ {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

### 4. `.dockerignore`

```
node_modules
.next
.git
.gitignore
README.md
.env*.local
*.log
.DS_Store
Thumbs.db
.vscode
.idea
docker-compose*.yml
nginx.conf
Dockerfile
.dockerignore
```

### 5. Usuario administrador automático

**Importante:** `lib/seed.mjs` **no debe** importar `dotenv` ni `node:url` — rompe el build de Next (webpack no maneja esos módulos en el bundle). El `dotenv` va solo en el CLI wrapper.

`lib/seed.mjs`:

```js
import mongoose from 'mongoose'
import User from '../models/User.js'
import Category from '../models/Category.js'
import StoreConfig from '../models/StoreConfig.js'

export async function runSeed() {
  if (!process.env.MONGODB_URI) {
    console.warn('[seed] MONGODB_URI no configurada, se omite el seed.')
    return
  }

  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  console.log('[seed] Connected to MongoDB')

  const adminExists = await User.findOne({ email: 'luismarin@usa.com' })
  if (!adminExists) {
    await User.create({
      email: 'luismarin@usa.com',
      password: 'LuisMarin.123',
      nome: 'Luis Marin',
      ruolo: 'admin',
    })
    console.log('[seed] Admin user created (luismarin@usa.com)')
  } else {
    console.log('[seed] Admin user already exists')
  }

  // ...categorías y config inicial (idempotente, crea solo lo que falta)...
  console.log('[seed] Seed completed successfully')
}
```

`lib/seed-cli.mjs` (para `npm run seed` manual):

```js
import 'dotenv/config'
import { runSeed } from './seed.mjs'

runSeed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[seed] Seed error:', error)
    process.exit(1)
  })
```

`instrumentation.js` (raíz — ejecuta el seed al arrancar el servidor):

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function ensureSeed() {
  const MAX_ATTEMPTS = 5

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { runSeed } = await import('./lib/seed.mjs')
      await runSeed()
      return
    } catch (error) {
      console.error(`[instrumentation] Seed attempt ${attempt}/${MAX_ATTEMPTS} failed:`, error?.message || error)
      if (attempt < MAX_ATTEMPTS) await sleep(5000)
    }
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await ensureSeed()
  }
}
```

En `package.json`:

```json
"scripts": {
  "seed": "node lib/seed-cli.mjs"
}
```

> El `register()` de `instrumentation.js` corre antes de que el servidor responda, es estable desde Next.js 15 y funciona en el output `standalone`. Si el seed falla tras los reintentos, la app igual arranca y el admin se creará en el próximo arranque/redeploy.

### 6. Configuración en Dokploy

1. Crea el proyecto y un servicio de tipo **Docker Compose** (o aplicación Dockerfile) apuntando al repo.
2. Configura estas variables de entorno en Dokploy:

| Variable | Valor |
|----------|-------|
| `MONGODB_URI` | Atlas (`mongodb+srv://...`) o interno (`mongodb://<mongo-service>:27017/db`) |
| `JWT_SECRET` | Clave secreta larga y aleatoria |
| `BOOTSTRAP_SECRET` | Secreto para crear el admin por API (opcional) |
| `NEXT_PUBLIC_URL` | `https://tudominio.com` (solo lo usa el servidor, p. ej. redirects de Google OAuth) |
| `APP_PORT` | *(opcional)* puerto externo, default `3000` |

3. **MongoDB** (opción A — Atlas): crea un cluster gratuito y copia el connection string en `MONGODB_URI`. (opción B — instancia en Dokploy): crea un servicio aparte con imagen `mongo:7`, volumen en `/data/db`, y apunta `MONGODB_URI=mongodb://<nombre-del-servicio>:27017/zest-pasticceria`.
4. Opcional: pega el `nginx.conf` en **Ajustes → Nginx** del proyecto (el proxy integrado de Dokploy también funciona).

> **API base URL relativa:** `lib/api.js` usa `baseURL: '/api'`. El navegador resuelve las llamadas contra el mismo origen, así que **no** se necesita `NEXT_PUBLIC_URL` en el cliente (evita `ERR_CONNECTION_REFUSED` cuando la variable no está o el dominio cambia).

### 7. Crear el admin por API (fallback)

Si el admin no se creó en el arranque, se puede crear por API con el endpoint `POST /api/auth/ensure-admin` (protegido con `BOOTSTRAP_SECRET`):

```bash
curl -X POST https://tudominio.com/api/auth/ensure-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <BOOTSTRAP_SECRET>" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin.123",
    "nome": "Admin"
  }'
```

Respuestas: `201` admin creado, `200` ya existía (se asegura el rol `admin`). Requisito: `BOOTSTRAP_SECRET` configurado en Dokploy.

### 8. Verificación

- En los logs de la app al primer arranque debe aparecer `[seed] Admin user created (luismarin@usa.com)` (o `already exists`).
- Entrar a `https://tudominio.com/login` con el admin y confirmar el acceso.

---

**Total estimado: ~22 días de desarrollo**
