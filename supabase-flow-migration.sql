-- ============================================
-- Migración: Agregar campos de Flow a la tabla orders
-- Ejecuta este script en el SQL Editor de Supabase
-- ============================================

-- Agregar columnas para Flow si no existen
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS flow_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS flow_commerce_order VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'flow';

-- Crear índice para búsquedas por commerce_order
CREATE INDEX IF NOT EXISTS idx_orders_flow_commerce_order ON orders(flow_commerce_order);

-- Crear índice para búsquedas por flow_token
CREATE INDEX IF NOT EXISTS idx_orders_flow_token ON orders(flow_token);

-- Comentarios para documentación
COMMENT ON COLUMN orders.flow_token IS 'Token de transacción de Flow';
COMMENT ON COLUMN orders.flow_commerce_order IS 'Número de orden de comercio en Flow';
COMMENT ON COLUMN orders.payment_method IS 'Método de pago utilizado (flow, etc.)';

