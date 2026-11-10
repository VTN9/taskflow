---
name: dev-planner
description: Planifica y ejecuta desarrollos por fases con control de ramas, pruebas obligatorias tras cada fase, integración exclusiva a develop, versionado estricto mediante SemVer sin llegar nunca a la versión 1 (0.y.z), y pase final a main exclusivamente tras aprobación explícita.
---

# Planificador de Desarrollo por Fases y Git Flow Estricto

Esta skill guía al agente de desarrollo para estructurar, versionar y ejecutar un proyecto paso a paso garantizando estabilidad, control de calidad y un flujo estricto de Git.

## Reglas Obligatorias de Operación

1. **Planificación por Fases:** Todo desarrollo grande debe dividirse en fases lógicas, claras y acotadas antes de escribir código.
2. **Rama y Versión por Fase:** Cada fase debe desarrollarse en su propia rama específica (ej: `feature/fase-X-nombre`) y contar con una versión SemVer asignada menor a `1.0.0` (`0.y.z`). **Nunca se llega a la versión 1.**
3. **Integración a Develop y Pruebas Obligatorias:**
   - Al finalizar cada fase, se deben ejecutar obligatoriamente los tests y validaciones correspondientes.
   - Una vez superados los tests, el código de la fase se integra exclusivamente en la rama `develop`, **nunca jamás a `main`**.
4. **Versionado Estricto (SemVer < 1.0.0):** El incremento de versión sigue el formato `0.y.z` (Major siempre es 0, Minor para nuevas funcionalidades por fase, Patch para correcciones).
5. **Pase Final a Main:** Solo cuando **todas** las fases del plan estén completadas, integradas en `develop`, testeadas en conjunto y se cuente con la **aprobación explícita (ok) del usuario**, se procederá a fusionar `develop` hacia `main`.

---

## Flujo de Trabajo a Seguir

### Fase 1: Creación del Plan de Desarrollo
Antes de iniciar cualquier código, presenta al usuario un desglose estructurado que contenga:
- **Fases del proyecto** con sus objetivos claros.
- **Rama asignada** para cada fase (ej. `feature/fase-1-setup`).
- **Versión SemVer asignada** (ej. `0.1.0`).

### Fase 2: Ejecución Fase por Fase
Para cada fase planificada, sigue este ciclo:
1. **Crear y cambiar a la rama de la fase** partiendo de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/fase-X-nombre
   ```
2. **Implementar la fase** con cambios acotados a su objetivo y asignar/actualizar la versión SemVer (`0.y.z`) correspondiente.
3. **Ejecutar los tests y validaciones obligatorias.** Si fallan, corregir y repetir hasta que pasen en verde; no se integra nada con tests en rojo.
4. **Commit de la fase** y **fusión exclusiva a `develop`** (nunca a `main`):
   ```bash
   git add .
   git commit -m "feat(fase-X): descripción breve"
   git checkout develop
   git merge --no-ff feature/fase-X-nombre
   ```
5. **Verificar en `develop`** ejecutando de nuevo los tests para confirmar que la fase no rompió nada en conjunto.
6. **Reportar** versión, rama y estado de tests, y pasar a la siguiente fase solo si todo está integrado y en verde.

### Fase 3: Verificación Global y Pase Final a Main
1. Confirmar que **todas** las fases están integradas en `develop`.
2. Ejecutar la **suite completa de tests** sobre `develop`.
3. Presentar un resumen del proyecto y **solicitar la aprobación explícita del usuario**.
4. **Solo con la aprobación explícita (ok)**, fusionar `develop` hacia `main`:
   ```bash
   git checkout main
   git pull origin main
   git merge --no-ff develop
   git push origin main
   ```
5. Sin aprobación, detenerse y dejar el proyecto en `develop`.

## Prohibiciones Absolutas
- **NUNCA** fusionar una fase directamente a `main`.
- **NUNCA** alcanzar ni superar la versión `1.0.0`.
- **NUNCA** integrar una fase en `develop` si los tests fallan.
- **NUNCA** fusionar `develop` a `main` sin aprobación explícita del usuario.
