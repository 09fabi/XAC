-- ============================================
-- Script SQL para corregir políticas RLS de user_profiles
-- Ejecuta este script en el SQL Editor de Supabase
-- Este script es seguro de ejecutar múltiples veces
-- ============================================

-- Eliminar políticas si existen (para poder recrearlas)
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own verification codes" ON email_verification_codes;
DROP POLICY IF EXISTS "Users can update own verification codes" ON email_verification_codes;

-- Política para permitir que los usuarios creen su propio perfil
CREATE POLICY "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- También agregar política para INSERT en email_verification_codes
CREATE POLICY "Users can insert own verification codes" 
  ON email_verification_codes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir UPDATE en email_verification_codes (para marcar como usado)
CREATE POLICY "Users can update own verification codes" 
  ON email_verification_codes FOR UPDATE 
  USING (auth.uid() = user_id);

