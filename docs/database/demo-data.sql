-- =====================================================
-- DATOS DE DEMO - Social Widget Ares
-- Ejecutar en SQL Editor de Supabase
-- =====================================================

-- Insertar tenant de demo
INSERT INTO tenants (
  slug,
  company_name,
  description,
  logo,
  primary_color,
  secondary_color,
  accent_color,
  border_radius,
  "position",
  plan,
  is_active
) VALUES (
  'demo-empresa',
  'Ares Technologies',
  '¡Contáctanos! Estamos disponibles para ayudarte.',
  NULL,
  '#1a1a2e',
  '#ffffff',
  '#6366f1',
  16,
  'bottom-right',
  'free',
  true
) RETURNING id, slug;

-- Obtener el ID del tenant demo (ejecutar después del anterior)
-- Luego ejecutar los INSERT de social_links con ese ID