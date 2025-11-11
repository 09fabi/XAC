# XuleriaLCorte - eCommerce MVP

Proyecto eCommerce MVP desarrollado con Next.js, TypeScript, TailwindCSS y Supabase para un trabajo universitario.

## 🚀 Características

- ✅ Catálogo de productos (ropa)
- ✅ Agregar productos al carrito
- ✅ Simulación de flujo de pago con Flow
- ✅ Páginas: Home, Tienda, Detalle de producto, Carrito, Perfil, Recomendaciones
- ✅ Sistema de recomendaciones (por categoría, color o productos similares)
- ✅ Integración con Supabase (PostgreSQL)
- ✅ Soporte para Cloudinary (imágenes)
- ✅ Diseño responsive con TailwindCSS

## 📋 Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos

### Backend
- **Next.js API Routes** - Endpoints del servidor

### Base de Datos
- **Supabase** (PostgreSQL) - Base de datos y autenticación

### Integraciones
- **Cloudinary** - Almacenamiento de imágenes
- **Flow** - Pasarela de pagos (Chile)
- **TensorFlow.js** - Recomendaciones ML (preparado para implementación)

### Hosting
- **Vercel** - Despliegue

## 🛠️ Instalación

1. **Clonar el repositorio** (o usar este proyecto)

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.local.example .env.local
```

Edita `.env.local` y agrega tus credenciales:
- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave anónima de Supabase
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Nombre de tu cuenta Cloudinary (opcional)
- `NEXT_PUBLIC_FLOW_API_KEY` - API Key de Flow (opcional)

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
xulerialcorte/
├── components/          # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── CartItem.tsx
├── context/            # Context API (Carrito)
│   └── CartContext.tsx
├── lib/                # Utilidades y configuraciones
│   └── supabase.ts
├── pages/              # Páginas y API routes
│   ├── api/            # API Routes
│   │   ├── products/
│   │   ├── cart.ts
│   │   ├── flow/
│   │   ├── recommendations.ts
│   │   └── orders.ts
│   ├── index.tsx       # Home
│   ├── store.tsx       # Tienda
│   ├── product/[id].tsx # Detalle producto
│   ├── cart.tsx        # Carrito
│   ├── profile.tsx     # Perfil
│   └── recommendations.tsx
├── styles/             # Estilos globales
│   └── globals.css
└── public/             # Archivos estáticos
```

## 🗄️ Configuración de Supabase

### Crear las tablas

Ejecuta estos comandos SQL en el editor SQL de Supabase:

```sql
-- Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT,
  description TEXT,
  category VARCHAR(100),
  color VARCHAR(50),
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios (si usas Supabase Auth, esta tabla se crea automáticamente)
-- Pero puedes crear una tabla de perfiles:
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajusta según tus necesidades)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
```

### Insertar datos de ejemplo

```sql
INSERT INTO products (name, price, image_url, description, category, color, stock, featured) VALUES
('Polera Básica Negra', 12990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'Polera básica de algodón', 'Poleras', 'Negro', 50, true),
('Jeans Clásicos', 29990, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'Jeans de corte clásico', 'Pantalones', 'Azul', 30, true),
('Chaqueta Denim', 39990, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'Chaqueta denim versátil', 'Chaquetas', 'Azul', 25, true);
```

## 💳 Configuración de Flow

1. Regístrate en [Flow](https://www.flow.cl/)
2. Obtén tu API Key desde el panel de administración
3. Agrega la clave a `.env.local` como `NEXT_PUBLIC_FLOW_API_KEY`
4. Configura las URLs de retorno en el panel de Flow:
   - URL de confirmación: `https://tu-dominio.com/api/flow/confirm`
   - URL de retorno: `https://tu-dominio.com/cart?payment=success`

## ☁️ Configuración de Cloudinary

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/)
2. Obtén tu `Cloud Name`, `API Key` y `API Secret`
3. Agrega las variables a `.env.local`

## 🚢 Despliegue en Vercel

1. **Conecta tu repositorio a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu proyecto desde GitHub/GitLab

2. **Configura las variables de entorno:**
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega todas las variables de `.env.local`

3. **Despliega:**
   - Vercel detectará automáticamente Next.js
   - El despliegue se realizará automáticamente

## 📝 Notas

- El proyecto incluye **datos mock** que se usan cuando Supabase no está configurado
- El carrito se guarda en `localStorage` del navegador
- Las recomendaciones usan lógica simple de filtrado (preparado para ML)
- Flow está configurado para modo sandbox/desarrollo

## 🎯 Próximos Pasos (Opcional)

- [ ] Implementar autenticación completa con Supabase Auth
- [ ] Integrar TensorFlow.js para recomendaciones ML avanzadas
- [ ] Configurar Flow en modo producción
- [ ] Agregar más productos y categorías
- [ ] Implementar búsqueda de productos
- [ ] Agregar filtros avanzados
- [ ] Implementar reviews/calificaciones

## 📄 Licencia

Este proyecto es para uso educativo/universitario.

## 👤 Autor

Desarrollado para trabajo universitario - XuleriaLCorte

