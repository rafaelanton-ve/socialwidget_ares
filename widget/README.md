# Social Widget Ares

Widget flotante embebible para redes sociales con estilo Vercel.

## Características

- **Shadow DOM**: Totalmente aislado del CSS del sitio host
- **Vanilla JavaScript**: Sin dependencias, peso mínimo
- **Estilo Vercel**: Diseño minimalista con animaciones suaves
- **Configuración dinámica**: Obtiene configuración desde Supabase
- **Iconos embebidos**: SVGs inline, sin llamadas externas
- **Responsivo**: Funciona en móviles y escritorio

## Instalación

```html
<script 
  src="https://tu-dominio.com/widget.js"
  data-tenant="tu-tenant-id">
</script>
```

## Configuración de Supabase

El widget espera una tabla `tenants` con la siguiente estructura:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | ID único del tenant |
| company_name | text | Nombre de la empresa |
| logo | text | URL del logo |
| description | text | Descripción breve |
| primary_color | text | Color primario (#000000) |
| secondary_color | text | Color secundario (#ffffff) |
| accent_color | text | Color de acento (#3b82f6) |
| border_radius | int | Radio de borde (16) |
| position | text | Posición (bottom-right) |
| social_links | json | Array de enlaces sociales |
| secondary_links | json | Array de enlaces adicionales |

## Personalización

Los tenants pueden configurar:
- Colores de la interfaz
- Logo y nombre de empresa
- Descripción
- Enlaces a redes sociales (WhatsApp, Instagram, Facebook, TikTok, etc.)
- Enlaces adicionales (sitio web, email, etc.)

## Desarrollo

```bash
# Instalar dependencias
npm install

# Build (minificar)
npm run build

# Servir para pruebas
npm run dev
```

## Licencia

MIT