# AGENTS.md

## Proyecto
Plataforma Multi-Tenant de Widgets Sticky para Redes Sociales (SaaS)

---

## Resumen General

Este proyecto consiste en una plataforma SaaS multi-tenant que permite crear, administrar y desplegar widgets flotantes embebibles en sitios web mediante un script único.

Cada cliente (tenant) tiene su propia configuración visual, contenido y enlaces, pero no tiene acceso al sistema administrativo. Es decir, cada cliente debe poder agregar los enlaces a redes sociales que tenga y su logo

El sistema debe ser liviano, escalable, modular y con actualización en tiempo real.

---

## Arquitectura General

El sistema se divide en 3 partes principales:

### 1. Dashboard Administrativo (SUPERADMIN)
- Gestión de tenants
- Configuración de widgets
- Administración de contenido y enlaces
- Preview en tiempo real
- Control total del sistema

### 2. Widget Embebible
- Script único instalable en cualquier web
- Renderizado dinámico según tenant
- UI flotante (sticky button)
- Modales interactivos
- Redirección a redes sociales
- Totalmente aislado del entorno host

### 3. Backend (Supabase)
- Base de datos PostgreSQL
- Auth (SUPERADMIN)
- Realtime updates
- API para configuración de tenants y widgets

---

## Stack Tecnológico

### Frontend (Admin Dashboard)
- Vue.js
- CSS vanilla
- Pinia (state management)
- Framer Motion o Vue Motion
- Component library opcional (shadcn-vue o equivalente)

### Widget
- Vanilla JavaScript (preferido)
- Shadow DOM para aislamiento CSS/JS
- Fetch API (no-store caching)
- Arquitectura ligera y modular

### Estilo Visual del Widget (Estilo Vercel)
- Diseño minimalista y limpio
- Colores neutros con acentos vibrantes sutiles
- Tipografía sans-serif moderna (Inter o similar)
- Bordes redondeados (border-radius: 12-16px)
- Sombras suaves y sutiles (box-shadow difuminado)
- Animaciones suaves en transiciones (200-300ms ease-out)
- Fondos con backdrop-blur en modales
- Espaciado generoso y consistente
- Iconos SVG embebidos en el proyecto (no externo)
- Micro-interacciones en hover (scale, opacity)

### Backend
- Supabase
  - PostgreSQL
  - Realtime subscriptions
  - Auth
  - Storage (opcional)

### Infraestructura
- Vercel (deploy frontend + widget CDN)
- GitHub (version control + CI/CD)

---

## Funcionamiento del Widget
- detecta el tenant
- obtiene la configuración desde Supabase
- renderiza un botón sticky flotante
- abre un modal principal
- permite acceder a un segundo modal con información ampliada
- redirige a redes sociales o comunidades
Roles
SUPERADMIN

### Script de instalación
Ejemplo:
```html
<script 
  src="https://widget.midominio.com/widget.js"
  data-tenant="tenant_id">
</script>