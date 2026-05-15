---
name: Creador de Skills
description: Una herramienta especializada para diseñar, estructurar y crear nuevas habilidades (skills) para Antigravity en español.
---

# Skill: Creador de Skills

Esta habilidad te permite generar nuevas capacidades para Antigravity siguiendo los estándares oficiales. Una "skill" es un conjunto de instrucciones, scripts y recursos que extienden las capacidades de la IA.

## 🛠 Estructura de una Skill

Cada skill debe residir en su propia carpeta dentro del directorio de habilidades y contener:

1.  **SKILL.md** (Obligatorio): El archivo maestro con instrucciones en formato Markdown y metadatos YAML.
2.  **scripts/** (Opcional): Scripts de apoyo (Python, Bash, Node.js, etc.).
3.  **examples/** (Opcional): Ejemplos de uso.
4.  **resources/** (Opcional): Archivos adicionales o activos.

## 📝 Formato de SKILL.md

El archivo `SKILL.md` debe comenzar con un bloque YAML:

```yaml
---
name: Nombre de la Habilidad
description: Descripción concisa de lo que hace.
---
```

Luego, debe incluir secciones detalladas sobre cómo la IA debe actuar cuando esta habilidad es relevante.

## 🚀 Cómo Crear una Nueva Skill con esta Herramienta

Para crear una nueva habilidad, sigue estos pasos:

1.  **Definir el Propósito**: ¿Qué problema resuelve la nueva habilidad?
2.  **Crear el Directorio**: `mkdir c:\Users\USUARIO\Documents\skills\nombre-de-la-skill`
3.  **Generar SKILL.md**: Crea el archivo con el frontmatter YAML y las instrucciones.
4.  **Añadir Lógica**: Si la habilidad requiere automatización, crea scripts en la carpeta `scripts/`.

## 💡 Consejos para Buenas Skills

- **Especificidad**: Define claramente cuándo y cómo debe usarse la habilidad.
- **Instrucciones Claras**: Usa un lenguaje directo y procedimental.
- **Modularidad**: Divide tareas complejas en scripts pequeños y reutilizables.
- **Documentación**: Asegúrate de que el `SKILL.md` sea fácil de leer tanto para humanos como para la IA.
