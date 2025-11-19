-- ============================================
-- Script SQL para agregar verificación por código
-- Ejecuta este script en el SQL Editor de Supabase
-- ============================================

-- Agregar columna de verificación de email a user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Tabla para almacenar códigos de verificación
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code VARCHAR(6) NOT NULL,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_verification_code_user 
ON email_verification_codes(user_id, code, used);

CREATE INDEX IF NOT EXISTS idx_verification_code_email 
ON email_verification_codes(email, code, used);

-- Habilitar RLS
ALTER TABLE email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Políticas para email_verification_codes
CREATE POLICY "Users can view own verification codes" 
  ON email_verification_codes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification codes" 
  ON email_verification_codes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verification codes" 
  ON email_verification_codes FOR UPDATE 
  USING (auth.uid() = user_id);

-- Función para limpiar códigos expirados (opcional, puede ejecutarse periódicamente)
CREATE OR REPLACE FUNCTION cleanup_expired_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM email_verification_codes
  WHERE expires_at < NOW() OR used = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Usuario'),
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta cuando se crea un usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Política para permitir que los usuarios creen su propio perfil
-- (Necesaria si el trigger falla o si se crea manualmente)
CREATE POLICY IF NOT EXISTS "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

