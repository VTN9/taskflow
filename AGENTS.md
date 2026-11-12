# AGENTS.md — TaskFlow

Guía para agentes de IA que trabajen en este repositorio.

## Proyecto

**TaskFlow / FocusApp** es una aplicación web de gestión de tareas (personal y profesional),
minimalista, con soporte offline/local, drag & drop, notificaciones y compartición en tiempo real.
El requerimiento completo está en `gemini-code-1794312391310.md` (PRD) y el plan por fases en
`planes/plan-de-desarrollo.md`.

## Stack

- React 19 + Vite 8 + TypeScript 7
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui + Radix UI, Lucide React
- Zustand (estado), Zod (validación) — a partir de la fase 2
- @dnd-kit (drag & drop) — fase 5
- Vitest + React Testing Library + Playwright (E2E) — fase 9
- Deploy: Vercel; persistencia cloud: Vercel KV / Upstash o Supabase — fase 7

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción (tsc -b && vite build)
npm run test         # tests unitarios (Vitest, una pasada)
npm run test:watch   # tests en modo watch
npm run lint         # oxlint
npm run typecheck    # tsc -b
npm run format       # Prettier
```

Antes de cerrar cualquier fase deben pasar: `test`, `lint`, `typecheck` y `build`.

## Estructura

```text
src/
├── components/      # componentes de UI (shadcn en components/ui)
├── hooks/           # hooks reutilizables
├── lib/             # utilidades (cn, helpers)
├── store/           # estado Zustand
├── types/           # tipos del dominio (User, List, Task, Tag)
├── test/            # setup de tests
├── App.tsx
└── main.tsx
planes/              # plan de desarrollo por fases
```

Alias de imports: `@/` → `src/`.

## Convenciones de código

- TypeScript estricto; evitar `any` y `@ts-ignore` sin justificación.
- Componentes funcionales con hooks; un componente por archivo.
- Estilos con Tailwind v4 y tokens de `src/index.css`; no CSS ad-hoc salvo casos justificados.
- Accesibilidad obligatoria (roles, labels, foco, teclado) en todo componente interactivo.
- Textos de UI y documentación en español.
- No añadir comentarios salvo que aporten contexto no evidente.
- No introducir dependencias nuevas sin necesidad clara y sin actualizar este archivo.

## Límite de tamaño de archivo (obligatorio)

- **Ningún archivo de código debe superar las 200 líneas.**
- Si un archivo se acerca al límite, dividirlo por responsabilidad:
  - componentes → subcomponentes en `components/`
  - lógica → hooks en `hooks/` o utilidades en `lib/`
  - tipos → `types/`
- Los tests también respetan el límite; dividir por caso o por módulo.
- Un archivo de más de 200 líneas se considera un defecto que debe corregirse antes de integrar.

## Flujo Git (estricto)

- Ramas: `main` (producción), `develop` (integración), `feature/fase-X-nombre` (por fase).
- Cada fase se desarrolla en su rama desde `develop` y se integra **solo** en `develop`
  con `git merge --no-ff`.
- Nunca fusionar una fase directamente a `main`.
- Nunca integrar una fase con tests en rojo.
- Versionado SemVer `0.y.z`; **nunca** alcanzar `1.0.0`.
- `develop` → `main` solo con aprobación explícita del usuario.
- Commits: `feat(fase-X): ...`, `fix(...)`, `docs(...)`, `chore(...)`, `test(...)`.
