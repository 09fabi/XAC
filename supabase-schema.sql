-- ============================================
-- Script SQL para crear las tablas en Supabase
-- Ejecuta este script en el SQL Editor de Supabase
-- ============================================

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
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

-- Tabla de usuarios/perfiles (si usas Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas para products (todos pueden leer)
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (true);

-- Políticas para user_profiles (usuarios solo pueden ver/editar su propio perfil)
CREATE POLICY "Users can view own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Políticas para orders (usuarios solo pueden ver sus propias órdenes)
CREATE POLICY "Users can view own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos productos de ejemplo con las nuevas categorías
INSERT INTO products (name, price, image_url, description, category, color, stock, featured) VALUES
('Polera Básica Negra', 12990, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'Polera básica de algodón 100%, perfecta para el día a día. Cómoda, suave y duradera.', 'POLERAS', 'Negro', 50, true),
('Polerón Oversize Gris', 34990, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 'Polerón oversize cómodo y cálido, perfecto para el invierno. Diseño moderno y versátil.', 'POLERONES', 'Gris', 30, true),
('Chaqueta Denim Clásica', 39990, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'Chaqueta denim versátil para cualquier ocasión. Diseño atemporal y resistente.', 'CHAQUETAS', 'Azul', 25, true),
('Jeans Clásicos', 29990, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'Jeans de corte clásico, cómodos y duraderos. Hechos con denim de alta calidad.', 'PANTALONES', 'Azul', 40, true),
('Conjunto Deportivo', 44990, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', 'Conjunto deportivo completo, cómodo y funcional. Perfecto para entrenar o uso casual.', 'CONJUNTOS', 'Negro', 20, false),
('Polera Estampada', 15990, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400', 'Polera con estampado exclusivo, diseño único. Material de alta calidad.', 'POLERAS', 'Blanco', 35, false),
('Polerón con Capucha', 37990, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', 'Polerón con capucha, abrigado y con estilo. Perfecto para días fríos.', 'POLERONES', 'Negro', 28, false),
('Chaqueta Bomber', 42990, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', 'Chaqueta bomber moderna, perfecta para el día a día. Diseño urbano y funcional.', 'CHAQUETAS', 'Negro', 22, false),
('Pantalón Cargo', 32990, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', 'Pantalón cargo funcional con múltiples bolsillos. Cómodo y práctico.', 'PANTALONES', 'Verde', 30, false),
('Conjunto Casual', 49990, 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400', 'Conjunto casual elegante, perfecto para cualquier ocasión. Estilo versátil.', 'CONJUNTOS', 'Beige', 15, false)
ON CONFLICT DO NOTHING;

