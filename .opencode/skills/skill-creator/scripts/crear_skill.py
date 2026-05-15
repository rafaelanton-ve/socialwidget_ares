import os
import sys

def create_skill_structure(skill_name):
    # Base path for skills
    base_path = r"C:\Users\USUARIO\Documents\skills"
    skill_path = os.path.join(base_path, skill_name.lower().replace(" ", "-"))
    
    # Create directories
    try:
        os.makedirs(skill_path, exist_ok=False)
        os.makedirs(os.path.join(skill_path, "scripts"), exist_ok=True)
        os.makedirs(os.path.join(skill_path, "examples"), exist_ok=True)
        os.makedirs(os.path.join(skill_path, "resources"), exist_ok=True)
        
        # Create initial SKILL.md
        skill_md_content = f"""---
name: {skill_name}
description: Breve descripción de {skill_name}.
---

# Skill: {skill_name}

## Propósito
Describe aquí para qué sirve esta habilidad.

## Guía de Uso
1. Paso uno.
2. Paso dos.

## Scripts Relacionados
- `scripts/`
"""
        with open(os.path.join(skill_path, "SKILL.md"), "w", encoding="utf-8") as f:
            f.write(skill_md_content)
            
        print(f"✅ Estructura de la skill '{skill_name}' creada con éxito en: {skill_path}")
        
    except FileExistsError:
        print(f"❌ Error: La carpeta '{skill_path}' ya existe.")
    except Exception as e:
        print(f"❌ Error inesperatedo: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python crear_skill.py 'Nombre de la Skill'")
    else:
        create_skill_structure(sys.argv[1])
