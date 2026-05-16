-- Insertar social_links para demo-empresa
INSERT INTO social_links (tenant_id, platform, url, label, icon, sort_order) VALUES 
('3d7d0e19-3cb6-4638-8fe7-afd91fca9752', 'whatsapp', 'https://wa.me/1234567890', 'WhatsApp', 'whatsapp', 1),
('3d7d0e19-3cb6-4638-8fe7-afd91fca9752', 'instagram', 'https://instagram.com/arestech', 'Instagram', 'instagram', 2),
('3d7d0e19-3cb6-4638-8fe7-afd91fca9752', 'facebook', 'https://facebook.com/arestech', 'Facebook', 'facebook', 3),
('3d7d0e19-3cb6-4638-8fe7-afd91fca9752', 'tiktok', 'https://tiktok.com/@arestech', 'TikTok', 'tiktok', 4);

-- Insertar secondary_links para demo-empresa
INSERT INTO secondary_links (tenant_id, label, url, icon, sort_order) VALUES 
('3d7d0e19-3cb6-4638-8fe7-afd91fca9752', 'Sitio web', 'https://arestech.com', 'globe', 1),
('3d7d0e19-3cb6-4638-8fe7-afd91fca9752', 'Correo', 'mailto:contacto@arestech.com', 'mail', 2);