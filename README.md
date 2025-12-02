# XAC - eCommerce MVP

Proyecto eCommerce MVP desarrollado con Next.js, TypeScript, TailwindCSS y Supabase.

## 🚀 Características

- Catálogo de productos (ropa)
- Agregar productos al carrito
- Flujo de pago con Flow
- Sistema de autenticación con Clerk
- Sistema de recomendaciones (por categoría, color o productos similares)
- Páginas: Home, Tienda, Detalle de producto, Carrito, Perfil, Recomendaciones
- Diseño responsive y minimalista

## 📋 Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con SSR
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos
- **Framer Motion** - Animaciones

### Backend
- **Next.js API Routes** - Endpoints del servidor

### Base de Datos
- **Supabase** (PostgreSQL) - Base de datos relacional

### Servicios Externos
- **Clerk** - Autenticación y gestión de usuarios
- **Cloudinary** - Almacenamiento y optimización de imágenes
- **Flow** - Pasarela de pagos (Chile)
- **TensorFlow.js** - Preparado para recomendaciones ML avanzadas

### Hosting
- **Vercel** - Despliegue y hosting

## 🛠️ Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd xulerialcorte
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
Crear archivo `.env.local` con:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_key
CLERK_SECRET_KEY=tu_clerk_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloudinary_name
NEXT_PUBLIC_FLOW_API_KEY=tu_flow_key
```

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
xulerialcorte/
├── app/                    # App Router (Next.js 13+)
│   ├── sign-in/           # Autenticación
│   ├── sign-up/
│   └── user-profile/
├── components/             # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── CartItem.tsx
├── context/                # React Context
│   ├── CartContext.tsx
│   └── AlertContext.tsx
├── lib/                    # Utilidades
│   ├── supabase.ts
│   └── cloudinary.ts
├── pages/                  # Pages Router
│   ├── api/               # API Routes
│   │   ├── products/
│   │   ├── flow/
│   │   ├── recommendations.ts
│   │   └── orders/
│   ├── index.tsx          # Home
│   ├── store.tsx          # Tienda
│   ├── product/[id].tsx   # Detalle producto
│   ├── cart.tsx          # Carrito
│   └── recommendations.tsx
├── styles/                # Estilos globales
│   └── globals.css
└── public/                # Archivos estáticos
```

## 🔐 Seguridad

- **Autenticación:** Clerk con OAuth (Google)
- **Row Level Security (RLS):** Implementado en Supabase
- **Middleware:** Protección de rutas con Next.js
- **Validación:** TypeScript y validación en API routes

## 🎨 Diseño

Diseño minimalista con paleta de colores negro y blanco, tipografía moderna y experiencia de usuario optimizada para todos los dispositivos.

## 📄 Licencia

Este proyecto es para uso educativo/universitario.
