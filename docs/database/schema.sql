-- =====================================================
-- SOCIAL WIDGET ARES - Schema de Base de Datos
-- Ejecute este archivo en el SQL Editor de Supabase
-- =====================================================

-- =====================================================
-- TABLA: tenants
-- Configuración principal de cada cliente
-- =====================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Identificación
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Información de la empresa
  company_name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  
  -- Diseño del widget
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#3b82f6',
  border_radius INTEGER DEFAULT 16,
  "position" TEXT DEFAULT 'bottom-right',
  
  -- Plan y límites
  plan TEXT DEFAULT 'free',
  monthly_clicks INTEGER DEFAULT 0,
  clicks_limit INTEGER DEFAULT 1000
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_is_active ON tenants(is_active);

-- =====================================================
-- TABLA: social_links
-- Redes sociales de cada tenant
-- =====================================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_links_tenant ON social_links(tenant_id);

-- =====================================================
-- TABLA: secondary_links
-- Enlaces adicionales (web, email, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS secondary_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_secondary_links_tenant ON secondary_links(tenant_id);

-- =====================================================
-- SEGURIDAD: Row Level Security (RLS)
-- =====================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE secondary_links ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública de tenants activos
CREATE POLICY "Public can read active tenants"
ON tenants FOR SELECT
USING (is_active = true);

-- Política: Lectura pública de social_links
CREATE POLICY "Public can read social_links"
ON social_links FOR SELECT
USING (
  tenant_id IN (SELECT id FROM tenants WHERE is_active = true)
);

-- Política: Lectura pública de secondary_links
CREATE POLICY "Public can read secondary_links"
ON secondary_links FOR SELECT
USING (
  tenant_id IN (SELECT id FROM tenants WHERE is_active = true)
);

-- =====================================================
-- TABLA: plans
-- Planes disponibles para tenants
-- =====================================================
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  monthly_price INTEGER DEFAULT 0,
  clicks_limit INTEGER DEFAULT 1000,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar planes por defecto
INSERT INTO plans (id, name, monthly_price, clicks_limit, features) VALUES
('free', 'Free', 0, 1000, '{"analytics": false, "custom_domain": false}'),
('pro', 'Pro', 9900, 10000, '{"analytics": true, "custom_domain": true}'),
('enterprise', 'Enterprise', 29900, -1, '{"analytics": true, "custom_domain": true, "priority_support": true}');

-- =====================================================
-- TENANT DE DEMO
-- Insertar datos de prueba
-- =====================================================
INSERT INTO tenants (
  slug,
  company_name,
  description,
  primary_color,
  secondary_color,
  accent_color,
  border_radius,
  "position",
  plan
) VALUES (
  'demo-empresa',
  'Demo Empresa',
  '¡Contáctanos! Estamos para ayudarte.',
  '#1a1a2e',
  '#ffffff',
  '#6366f1',
  16,
  'bottom-right',
  'free'
) RETURNING id;

-- Obtener el ID del tenant demo (ejecutar separadamente)
-- INSERT INTO social_links (tenant_id, platform, url, label, sort_order)
-- VALUES ('ID-AQUI', 'whatsapp', 'https://wa.me/123456789', 'WhatsApp', 1);

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para obtener configuración completa de un tenant
CREATE OR REPLACE FUNCTION get_tenant_config(tenant_slug TEXT)
RETURNS TABLE (
  id UUID,
  company_name TEXT,
  logo TEXT,
  description TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  border_radius INTEGER,
  "position" TEXT,
  social_links JSONB,
  secondary_links JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.company_name,
    t.logo,
    t.description,
    t.primary_color,
    t.secondary_color,
    t.accent_color,
    t.border_radius,
    t."position",
    COALESCE(
      (
        SELECT json_agg(json_build_object(
          'platform', platform,
          'url', url,
          'label', label,
          'icon', icon,
          'sort_order', sort_order
        ) ORDER BY sort_order)
        FROM social_links
        WHERE tenant_id = t.id AND is_visible = true
      ),
      '[]'::jsonb
    ) AS social_links,
    COALESCE(
      (
        SELECT json_agg(json_build_object(
          'label', label,
          'url', url,
          'icon', icon,
          'sort_order', sort_order
        ) ORDER BY sort_order)
        FROM secondary_links
        WHERE tenant_id = t.id AND is_visible = true
      ),
      '[]'::jsonb
    ) AS secondary_links
  FROM tenants t
  WHERE t.slug = tenant_slug AND t.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar clic en enlace
CREATE OR REPLACE FUNCTION register_link_click(
  link_id UUID,
  link_type TEXT
) RETURNS VOID AS $$
BEGIN
  IF link_type = 'social' THEN
    UPDATE social_links SET clicks = clicks + 1 WHERE id = link_id;
  ELSIF link_type = 'secondary' THEN
    UPDATE secondary_links SET clicks = clicks + 1 WHERE id = link_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CONFIGURACIÓN DE STORAGE (para logos)
-- =====================================================

-- Crear bucket para logos de tenants
INSERT INTO storage.buckets (id, name, public)
VALUES ('tenant-logos', 'tenant-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública para logos
CREATE POLICY "Public can access tenant logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'tenant-logos');

-- =====================================================
-- HABILITAR EXTENSIONES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Ejecutar para verificar tablas creadas:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';