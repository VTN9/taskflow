# Plan de Desarrollo — TaskFlow / FocusApp

> Basado en el PRD (`gemini-code-1794312391310.md`) y en las reglas del skill `dev-planner`.
> Versionado SemVer estricto `0.y.z` (nunca se alcanza `1.0.0`). Cada fase se integra
> **solo** en `develop` tras pasar sus tests. `main` solo recibe `develop` con aprobación explícita final.

---

## 1. Stack y arquitectura

| Capa | Tecnología |
| :--- | :--- |
| Hosting & Deploy | Vercel |
| Framework Frontend | React 19 + Vite + TypeScript (Next.js 15+ App Router como alternativa si se requiere SSR/Server Actions) |
| Estilos | Tailwind CSS v4 |
| Componentes UI | shadcn/ui + Radix UI |
| Iconografía | Lucide React |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Persistencia Cloud | Vercel KV / Upstash Redis o Supabase (JSONB) |
| Persistencia Local | localStorage (modo offline) |
| Notificaciones | Web Notifications API + Sonner |
| Estado | Zustand (store tipado con persistencia) |
| Tests | Vitest + React Testing Library + Playwright (E2E) |

### Ramas

- `main`: producción, protegida. Solo recibe `develop` con aprobación explícita.
- `develop`: integración continua de fases.
- `feature/fase-X-nombre`: una rama por fase, creada desde `develop`.

### Modelo de datos

Estado JSON según el PRD: `user`, `lists`, `tasks`, `tags`. Tipos TypeScript en `src/types/`.

---

## 2. Fases del proyecto

| Fase | Rama | Versión | Objetivo |
| :--- | :--- | :--- | :--- |
| 1 | `feature/fase-1-setup` | `0.1.0` | Scaffolding, tooling y base de calidad |
| 2 | `feature/fase-2-modelo-estado` | `0.2.0` | Tipos, store Zustand y persistencia local |
| 3 | `feature/fase-3-crud-tareas` | `0.3.0` | CRUD de listas y tareas |
| 4 | `feature/fase-4-vistas-filtros` | `0.4.0` | Vistas por estado, prioridad, tags y fechas |
| 5 | `feature/fase-5-drag-drop` | `0.5.0` | Reordenación con @dnd-kit |
| 6 | `feature/fase-6-ui-ux` | `0.6.0` | Tema, responsive, micro-interacciones y toasts |
| 7 | `feature/fase-7-cloud-sharing` | `0.7.0` | Persistencia cloud y compartir en tiempo real |
| 8 | `feature/fase-8-notificaciones` | `0.8.0` | Recordatorios y Web Notifications |
| 9 | `feature/fase-9-deploy-e2e` | `0.9.0` | Deploy en Vercel, E2E y hardening |

### Fase 1 — Setup (0.1.0)

- **Objetivo:** proyecto React 19 + Vite + TypeScript con Tailwind v4, shadcn/ui, Lucide, ESLint/Prettier y Vitest configurados.
- **Entregables:** estructura `src/`, alias `@/`, `.env.example`, scripts `dev`, `build`, `test`, `lint`, `typecheck`.
- **Tests:** smoke test de render de `App`; `lint` y `typecheck` en verde.
- **DoD:** `npm run build`, `npm run test`, `npm run lint` y `npm run typecheck` pasan.

### Fase 2 — Modelo y estado (0.2.0)

- **Objetivo:** tipos del PRD (`User`, `List`, `Task`, `Tag`, `Settings`), store Zustand y persistencia en `localStorage`.
- **Entregables:** `src/types/`, `src/store/`, selectores y acciones base, migración/versionado del estado persistido.
- **Tests:** unitarios de store (crear/leer/actualizar estado, hidratación y persistencia).
- **DoD:** tests unitarios en verde y estado sobrevive a recarga.

### Fase 3 — CRUD listas y tareas (0.3.0)

- **Objetivo:** crear, editar, completar y eliminar listas y tareas; papelera (`trashed`).
- **Entregables:** formularios accesibles (Radix/shadcn), validación con Zod, acciones del store, confirmaciones.
- **Tests:** unitarios de acciones + componentes con Testing Library.
- **DoD:** flujo CRUD cubierto por tests.

### Fase 4 — Vistas y filtros (0.4.0)

- **Objetivo:** vistas por estado (`todo`, `in-progress`, `completed`, `trashed`), prioridad, categoría, tags y fechas.
- **Entregables:** filtros combinables, búsqueda, orden por `order`/`dueDate`, badges de prioridad y colores de tags.
- **Tests:** tests de filtrado/orden y de componentes de vista.
- **DoD:** cada filtro y combinación relevante cubierto.

### Fase 5 — Drag & Drop (0.5.0)

- **Objetivo:** reordenar tareas dentro de una lista con @dnd-kit, accesible por teclado.
- **Entregables:** `SortableContext`, persistencia de `order`, indicadores visuales.
- **Tests:** unitarios de reordenación y accesibilidad por teclado.
- **DoD:** el orden persiste tras recarga y funciona con teclado.

### Fase 6 — UI/UX (0.6.0)

- **Objetivo:** tema claro/oscuro/sistema, layout responsive, micro-interacciones y toasts con Sonner.
- **Entregables:** ThemeProvider, animaciones (Framer Motion opcional), estados vacíos y de carga, feedback visual.
- **Tests:** tests de cambio de tema y de render responsive básico.
- **DoD:** tema persiste; UI usable en móvil y escritorio.

### Fase 7 — Cloud y compartir (0.7.0)

- **Objetivo:** sincronización cloud (Vercel KV/Upstash o Supabase) y enlaces de compartir con `shareToken` y `sharedMode`.
- **Entregables:** API serverless, sincronización, vista pública de solo lectura/escritura, manejo offline→online.
- **Tests:** tests de API (contratos), integración de sincronización y E2E de enlace compartido.
- **DoD:** compartir funciona en vivo y hay resolución de conflictos definida.

### Fase 8 — Notificaciones (0.8.0)

- **Objetivo:** recordatorios por `reminder` y notificaciones nativas + toasts.
- **Entregables:** permisos, programación de recordatorios, preferencias (`notificationsEnabled`, `soundEnabled`).
- **Tests:** unitarios de lógica de recordatorios y mocks de la Notifications API.
- **DoD:** recordatorio dispara notificación con permiso concedido y degrada con elegancia si se deniega.

### Fase 9 — Deploy y E2E (0.9.0)

- **Objetivo:** deploy en Vercel, suite E2E y hardening.
- **Entregables:** configuración Vercel, variables de entorno, Playwright, revisión de accesibilidad, performance y seguridad.
- **Tests:** suite E2E completa (CRUD, drag & drop, compartir, notificaciones) + `lint`/`typecheck`/`build`.
- **DoD:** todo en verde en `develop` y preview de Vercel funcionando.

---

## 3. Ciclo obligatorio por fase

```bash
git checkout develop
git pull origin develop
git checkout -b feature/fase-X-nombre
# implementar fase
npm run test && npm run lint && npm run typecheck
git add .
git commit -m "feat(fase-X): descripción breve"
git checkout develop
git merge --no-ff feature/fase-X-nombre
# verificar tests en develop
```

No se integra ninguna fase con tests en rojo.

---

## 4. Cierre del proyecto

1. Confirmar todas las fases integradas en `develop`.
2. Ejecutar la suite completa (unit + integración + E2E) sobre `develop`.
3. Presentar resumen y **solicitar aprobación explícita**.
4. Solo con el "ok", fusionar `develop` → `main` y desplegar en Vercel.

---

## 5. Prohibiciones absolutas

- Nunca fusionar una fase directamente a `main`.
- Nunca alcanzar ni superar la versión `1.0.0`.
- Nunca integrar una fase en `develop` con tests fallando.
- Nunca fusionar `develop` a `main` sin aprobación explícita.
