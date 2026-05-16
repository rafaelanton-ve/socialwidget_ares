# Configuración de Supabase para Social Widget Ares

## Pasos para conectar el proyecto

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Click en "New Project"
3. Completa los datos:
   - **Name**: `social-widget-ares`
   - **Database Password**: Crea una contraseña segura
   - **Region**: Selecciona la más cercana (ej: US East)
4. Click en "Create new project"
5. Espera ~2 minutos mientras se aprovisiona

---

### 2. Obtener credenciales

Una vez creado el proyecto, en el panel:

1. **Project Settings** (ícono de engranaje) → **API**
2. Copia estos valores:

| Campo | Valor para widget.js | Valor para Dashboard |
|-------|---------------------|---------------------|
| Project URL | ✅ | |
| anon public (Key) | ✅ | |
| service_role (Key) | | ✅ (NUNCA en cliente) |

---

### 3. Credenciales para el Widget

El widget necesita:
- **Project URL**: `https://xxxxx.supabase.co`
- **anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Lugar en el código**: `widget/src/widget.js` líneas 66-71

```javascript
const response = await fetch(
  `https://TU-PROJECT.supabase.co/rest/v1/tenants?id=eq.${this.tenantId}&select=*`,
  {
    headers: {
      'apikey': 'TU-ANON-KEY',
      'Authorization': 'Bearer TU-ANON-KEY'
    },
    cache: 'no-store'
  }
);
```

---

### 4. Ejecutar Schema de Base de Datos

Tienes 2 opciones:

#### Opción A: Desde el Editor SQL de Supabase (Recomendado)

1. Ve a **SQL Editor** en el menú lateral
2. Copia el contenido de `docs/database/schema.sql`
3. Click en **Run**

#### Opción B: Desde CLI

```bash
# Instalar CLI si no lo tienes
npm install -g supabase

# Vincular proyecto
supabase link --project-ref TU-PROJECT-REF

# Ejecutar migrations
supabase db push
```

---

## Estructura de tablas a crear

```
tenants (configuración principal)
├── id (UUID)
├── slug (identificador único)
├── company_name
├── logo, description
├── primary_color, secondary_color, accent_color
├── border_radius, position
├── plan, clicks_limit
└── social_links (relación 1:N)
    ├── platform, url, label
    └── sort_order
└── secondary_links (relación 1:N)
    ├── label, url
    └── sort_order
```

---

## siguiente paso

Una vez creado el proyecto Supabase, proporciona:

1. **Project URL**: `https://xxxxx.supabase.co`
2. **anon Key**: La clave pública

Y ejecutaré el script SQL para crear las tablas automáticamente.