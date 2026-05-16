-- =====================================================
-- DATOS COMPLETOS DE DEMO
-- Ejecutar TODO de una vez en SQL Editor
-- =====================================================

-- 1. Crear tenant demo (si no existe)
INSERT INTO tenants (slug, company_name, description, primary_color, secondary_color, accent_color, border_radius, "position", plan, is_active)
SELECT 'demo-empresa', 'Ares Technologies', '¡Contáctanos! Estamos para ayudarte.', '#1a1a2e', '#ffffff', '#6366f1', 16, 'bottom-right', 'free', true
WHERE NOT EXISTS (SELECT 1 FROM tenants WHERE slug = 'demo-empresa')
RETURNING id;

-- 2. Obtener ID y crear social_links
-- Ejecutar después de verificar que el tenant existe:
-- SELECT id FROM tenants WHERE slug = 'demo-empresa';

-- 3. Luego ejecutar (reemplazando el ID):
-- INSERT INTO social_links (tenant_id, platform, url, label, icon, sort_order) VALUES 
-- ('AQUI-EL-ID', 'whatsapp', 'https://wa.me/1234567890', 'WhatsApp', 'whatsapp', 1),
-- ('AQUI-EL-ID', 'instagram', 'https://instagram.com/arestech', 'Instagram', 'instagram', 2),
-- ('AQUI-EL-ID', 'facebook', 'https://facebook.com/arestech', 'Facebook', 'facebook', 3),
-- ('AQUI-EL-ID', 'tiktok', 'https://tiktok.com/@arestech', 'TikTok', 'tiktok', 4);

-- 4. Secondary links:
-- INSERT INTO secondary_links (tenant_id, label, url, icon, sort_order) VALUES 
-- ('AQUI-EL-ID', 'Sitio web', 'https://arestech.com', 'globe', 1),
-- ('AQUI-EL-ID', 'Correo', 'mailto:contacto@arestech.com', 'mail', 2);