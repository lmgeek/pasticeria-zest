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

### 5. Primer inicio — Seed de datos

El seed crea el admin y los datos iniciales (es idempotente, se puede correr varias veces). Ejecútalo **desde tu máquina** apuntando a la base de producción:

```bash
MONGODB_URI="mongodb://zest-mongodb:27017/zest-pasticceria" npm run seed
```

> Si `MONGODB_URI` usa el hostname interno de Dokploy (`zest-mongodb`), ejecútalo localmente con la IP pública del servidor (`mongodb://IP_DEL_SERVIDOR:27017/zest-pasticceria`) o desde otro contenedor dentro de la red de Dokploy.

Esto creará:
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

**Total estimado: ~22 días de desarrollo**
