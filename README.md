# TaskFlow

Gestor de tareas minimalista con soporte local/offline, drag & drop, recordatorios y compartición.

- App: https://taskflow-mocha-two-80.vercel.app
- Stack: React 19, Vite, TypeScript, Tailwind CSS v4, Zustand, Zod y dnd-kit.

## Desarrollo

```bash
npm install
npm run dev
```

## Pruebas

```bash
npm run test
npm run test:e2e
```

## Despliegue

Cada push a `main` despliega en producción mediante GitHub Actions
(`.github/workflows/deploy-vercel.yml`).
