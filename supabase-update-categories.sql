-- ============================================
-- Script SQL para actualizar categorías en Supabase
-- Ejecuta este script en el SQL Editor de Supabase
-- ============================================

-- Actualizar productos existentes a las nuevas categorías
-- Si tienes productos con categorías antiguas, actualízalos así:

-- Actualizar productos de "Vestidos" a "CONJUNTOS" (si aplica)
UPDATE products 
SET category = 'CONJUNTOS' 
WHERE category = 'Vestidos';

-- Actualizar productos de "Camisas" a "POLERAS" (si aplica)
UPDATE products 
SET category = 'POLERAS' 
WHERE category = 'Camisas';

-- Actualizar productos de "Shorts" a "PANTALONES" (si aplica)
UPDATE products 
SET category = 'PANTALONES' 
WHERE category = 'Shorts';

-- Actualizar categorías antiguas a mayúsculas
UPDATE products 
SET category = 'POLERAS' 
WHERE category = 'Poleras';

UPDATE products 
SET category = 'POLERONES' 
WHERE category = 'Polerones';

UPDATE products 
SET category = 'PANTALONES' 
WHERE category = 'Pantalones';

UPDATE products 
SET category = 'CHAQUETAS' 
WHERE category = 'Chaquetas';

UPDATE products 
SET category = 'CONJUNTOS' 
WHERE category = 'Conjuntos';

-- Eliminar productos de ejemplo antiguos (opcional)
-- DELETE FROM products WHERE category IN ('Vestidos', 'Camisas', 'Shorts');

-- Insertar nuevos productos con las categorías correctas
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

-- Verificar las categorías actuales
SELECT DISTINCT category FROM products ORDER BY category;


