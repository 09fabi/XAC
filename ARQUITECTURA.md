# 🏗️ Arquitectura del Sistema - XuleriaLCorte

Este documento describe la arquitectura final implementada del MVP de XuleriaLCorte, incluyendo la estructura de componentes, flujos de datos y decisiones arquitectónicas.

---

## 📐 Arquitectura General

### Tipo de Arquitectura
**Arquitectura:** Full-Stack Monolítica con Next.js (JAMstack)

**Justificación:**
- Next.js permite tener frontend y backend en un solo proyecto
- API Routes funcionan como backend sin servidor separado
- Despliegue simplificado en Vercel
- Adecuado para MVP y proyectos medianos

---

## 🗂️ Estructura del Proyecto

```
xulerialcorte/
├── app/                    # App Router (Next.js 13+)
│   ├── account/           # Página de cuenta
│   ├── sign-in/           # Autenticación - Login
│   ├── sign-up/           # Autenticación - Registro
│   ├── user-profile/      # Perfil de usuario
│   └── layout.tsx         # Layout principal
│
├── pages/                 # Pages Router (Next.js tradicional)
│   ├── api/               # API Routes (Backend)
│   │   ├── auth/          # Endpoints de autenticación
│   │   ├── flow/          # Integración con Flow (pagos)
│   │   ├── orders/        # Gestión de órdenes
│   │   ├── products/      # CRUD de productos
│   │   ├── recommendations.ts  # Sistema de recomendaciones
│   │   └── upload/        # Subida de imágenes
│   │
│   ├── index.tsx          # Home / Landing page
│   ├── store.tsx          # Catálogo de productos
│   ├── product/[id].tsx   # Detalle de producto
│   ├── cart.tsx           # Carrito de compras
│   └── recommendations.tsx # Página de recomendaciones
│
├── components/            # Componentes React reutilizables
│   ├── Navbar.tsx         # Barra de navegación
│   ├── Footer.tsx         # Pie de página
│   ├── ProductCard.tsx    # Tarjeta de producto
│   ├── CartItem.tsx       # Item del carrito
│   └── ui/                # Componentes UI base
│
├── context/               # React Context (Estado global)
│   ├── CartContext.tsx    # Estado del carrito
│   └── AlertContext.tsx   # Sistema de alertas
│
├── lib/                   # Utilidades y configuraciones
│   ├── supabase.ts        # Cliente de Supabase
│   ├── cloudinary.ts      # Configuración de Cloudinary
│   └── clerk-localization.ts # Localización de Clerk
│
├── middleware.ts          # Middleware de Next.js (protección de rutas)
├── styles/                # Estilos globales
└── public/                # Archivos estáticos
```

---

## 🔄 Flujos Principales

### 1. Flujo de Autenticación

```
Usuario → /sign-in
    ↓
Clerk Authentication
    ↓
Verificación de sesión
    ↓
Middleware (middleware.ts)
    ↓
Redirección a página protegida o pública
```

**Componentes Involucrados:**
- `middleware.ts` - Protección de rutas
- `app/sign-in/page.tsx` - UI de login
- `app/sign-up/page.tsx` - UI de registro
- Clerk SDK - Gestión de sesiones

**Seguridad:**
- Middleware verifica autenticación antes de permitir acceso
- Rutas públicas definidas explícitamente
- Tokens gestionados por Clerk

---

### 2. Flujo de Navegación y Productos

```
Usuario → /store (Tienda)
    ↓
Carga de productos desde Supabase
    ↓
Renderizado de ProductCard components
    ↓
Usuario hace clic en producto
    ↓
Navegación a /product/[id]
    ↓
Carga de detalles del producto
    ↓
Usuario agrega al carrito
    ↓
Actualización de CartContext (localStorage)
```

**Componentes Involucrados:**
- `pages/store.tsx` - Lista de productos
- `pages/product/[id].tsx` - Detalle de producto
- `components/ProductCard.tsx` - Tarjeta de producto
- `context/CartContext.tsx` - Estado del carrito
- `pages/api/products/index.ts` - API de productos

**Almacenamiento:**
- Productos: Supabase (PostgreSQL)
- Carrito: localStorage (cliente) + Context API

---

### 3. Flujo de Recomendaciones

```
Usuario navega a /recommendations
    ↓
Carga de productos del carrito (CartContext)
    ↓
Extracción de categorías y colores
    ↓
Request POST a /api/recommendations
    ↓
Lógica de recomendación (filtrado)
    ↓
Consulta a Supabase (si configurado)
    ↓
Retorno de productos recomendados
    ↓
Renderizado en página de recomendaciones
```

**Componentes Involucrados:**
- `pages/recommendations.tsx` - UI de recomendaciones
- `pages/api/recommendations.ts` - Lógica de recomendación
- `context/CartContext.tsx` - Datos del carrito
- `lib/supabase.ts` - Cliente de base de datos

**Algoritmo de Recomendación:**
1. **Por Categoría:** Filtra productos con categorías del carrito
2. **Por Color:** Filtra productos con colores del carrito
3. **Similares:** Misma categoría, diferente producto

---

### 4. Flujo de Pago (Flow)

```
Usuario en /cart
    ↓
Usuario hace clic en "Pagar"
    ↓
Request a /api/flow/create-payment
    ↓
Creación de orden en Supabase
    ↓
Creación de pago en Flow
    ↓
Redirección a Flow (pasarela de pago)
    ↓
Usuario completa pago en Flow
    ↓
Callback a /api/flow/confirm
    ↓
Actualización de orden en Supabase
    ↓
Redirección a /cart?payment=success
```

**Componentes Involucrados:**
- `pages/cart.tsx` - Carrito de compras
- `pages/api/flow/create-payment.ts` - Crear pago
- `pages/api/flow/confirm.ts` - Confirmar pago
- `pages/api/orders/create.ts` - Crear orden
- Flow API - Pasarela de pagos externa

**Seguridad:**
- Validación de datos antes de crear pago
- Verificación de firma en callback de Flow
- Actualización segura de órdenes

---

## 🗄️ Arquitectura de Datos

### Base de Datos (Supabase/PostgreSQL)

**Esquema Principal:**

```
products
├── id (UUID, PK)
├── name (VARCHAR)
├── price (INTEGER)
├── image_url (TEXT)
├── description (TEXT)
├── category (VARCHAR)
├── color (VARCHAR)
├── stock (INTEGER)
├── featured (BOOLEAN)
└── timestamps

user_profiles
├── id (UUID, PK, FK → auth.users)
├── name (VARCHAR)
├── email (VARCHAR)
└── timestamps

orders
├── id (UUID, PK)
├── user_id (UUID, FK → auth.users)
├── total (INTEGER)
├── status (VARCHAR)
├── items (JSONB)
└── timestamps
```

**Relaciones:**
- `user_profiles.id` → `auth.users.id` (1:1)
- `orders.user_id` → `auth.users.id` (N:1)

**Seguridad (RLS):**
- `products`: Lectura pública, escritura protegida
- `user_profiles`: Solo acceso propio
- `orders`: Solo acceso a propias órdenes

---

## 🔐 Arquitectura de Seguridad

### Capas de Seguridad

```
1. Middleware (Next.js)
   └── Protección de rutas
       └── Verificación de autenticación (Clerk)

2. Autenticación (Clerk)
   └── Gestión de sesiones
       └── Tokens JWT
           └── OAuth (Google)

3. Row Level Security (Supabase)
   └── Políticas a nivel de base de datos
       └── Prevención de acceso no autorizado

4. Variables de Entorno
   └── Credenciales sensibles
       └── Separación de claves públicas/privadas

5. Validación de Datos
   └── TypeScript (tipos)
       └── Validación en API routes
```

---

## 🌐 Arquitectura de Despliegue

### Infraestructura en Vercel

```
Internet
    ↓
Vercel CDN (Global)
    ↓
Next.js Application
    ├── Static Assets (CDN)
    ├── Server-Side Rendering
    └── API Routes
        ↓
Servicios Externos
    ├── Supabase (PostgreSQL)
    ├── Clerk (Autenticación)
    ├── Cloudinary (Imágenes)
    └── Flow (Pagos)
```

**Características:**
- **CDN Global:** Distribución de contenido en múltiples regiones
- **HTTPS Automático:** Certificados SSL gestionados
- **Auto-scaling:** Escala según demanda
- **Deploy Automático:** CI/CD con Git

---

## 🔄 Flujo de Datos

### Request/Response Flow

```
Cliente (Browser)
    ↓
Next.js Middleware
    ↓
API Route o Page Component
    ↓
Supabase Client / Clerk / Flow API
    ↓
Base de Datos / Servicio Externo
    ↓
Response
    ↓
Cliente (Browser)
```

### Estado Global (Context API)

```
CartContext
    ├── Estado: cart (array)
    ├── Funciones: addItem, removeItem, clearCart
    └── Persistencia: localStorage
```

---

## 📦 Gestión de Dependencias

### Dependencias Principales

**Frontend:**
- `next` - Framework
- `react` - Biblioteca UI
- `typescript` - Lenguaje
- `tailwindcss` - Estilos
- `framer-motion` - Animaciones

**Backend/Servicios:**
- `@supabase/supabase-js` - Cliente de base de datos
- `@clerk/nextjs` - Autenticación
- `cloudinary` - Almacenamiento de imágenes

**ML (Preparado):**
- `@tensorflow/tfjs` - Machine Learning en el cliente

---

## 🎯 Decisiones Arquitectónicas Clave

### 1. Next.js Pages Router + App Router
**Decisión:** Usar ambos routers según necesidad.

**Razón:**
- App Router para nuevas páginas (autenticación)
- Pages Router para páginas existentes y API routes
- Migración gradual posible

### 2. Context API vs Redux
**Decisión:** Context API para estado global.

**Razón:**
- Suficiente para el tamaño del proyecto
- Menos complejidad
- No requiere librería externa

### 3. localStorage para Carrito
**Decisión:** Persistir carrito en localStorage.

**Razón:**
- Funciona sin autenticación
- Persiste entre sesiones
- Rápido y simple

### 4. API Routes vs Backend Separado
**Decisión:** API Routes de Next.js.

**Razón:**
- Todo en un solo proyecto
- Deploy simplificado
- Adecuado para MVP

---

## 📊 Diagrama de Componentes

```
┌─────────────────────────────────────────┐
│         Next.js Application          │
│  ┌─────────────────────────────────┐  │
│  │      Pages (Frontend)          │  │
│  │  - Home, Store, Cart, etc.    │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │      API Routes (Backend)      │  │
│  │  - Products, Orders, Flow, etc.│  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │      Middleware (Security)     │  │
│  │  - Route Protection             │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │         │         │
           ↓         ↓         ↓
    ┌──────────┐ ┌──────┐ ┌─────────┐
    │ Supabase │ │Clerk │ │Cloudinary│
    │ (PostgreSQL)│(Auth)│ │(Images) │
    └──────────┘ └──────┘ └─────────┘
           │
           ↓
    ┌──────────┐
    │   Flow   │
    │ (Payments)│
    └──────────┘
```

---

## 🚀 Escalabilidad Futura

### Preparado para:
1. **ML Avanzado:** TensorFlow.js ya incluido
2. **Real-time:** Supabase tiene soporte real-time
3. **Microservicios:** API Routes pueden separarse
4. **Cache:** Next.js tiene cache integrado
5. **CDN:** Vercel proporciona CDN global

### Mejoras Futuras:
- Implementar Redis para cache
- Separar API en microservicios si crece
- Implementar WebSockets para real-time
- Agregar service workers para PWA
- Implementar ML avanzado con TensorFlow.js

---

## 📝 Conclusión

La arquitectura implementada es:
- ✅ **Modular:** Componentes reutilizables
- ✅ **Escalable:** Preparada para crecer
- ✅ **Segura:** Múltiples capas de seguridad
- ✅ **Mantenible:** Código organizado y documentado
- ✅ **Moderno:** Usa tecnologías actuales
- ✅ **Adecuada para MVP:** Balance entre simplicidad y funcionalidad

