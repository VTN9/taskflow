import { CheckCircle2, ListTodo } from 'lucide-react'

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-3">
        <ListTodo className="size-10 text-primary" aria-hidden="true" />
        <h1 className="text-4xl font-semibold tracking-tight">TaskFlow</h1>
      </div>
      <p className="max-w-md text-center text-muted-foreground">
        Gestiona tus tareas personales y profesionales con un flujo minimalista.
      </p>
      <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm text-card-foreground">
        <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
        Base del proyecto lista
      </div>
    </main>
  )
}

export default App
