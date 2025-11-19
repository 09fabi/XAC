-- ============================================
-- Script para verificar qué políticas RLS existen
-- Ejecuta este script para ver el estado actual
-- ============================================

-- Ver políticas de user_profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- Ver políticas de email_verification_codes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'email_verification_codes'
ORDER BY policyname;

