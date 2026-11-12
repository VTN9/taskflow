import { useEffect, useState } from 'react'
import { PriorityBadge } from '@/components/tasks/PriorityBadge'
import { formatDate } from '@/lib/date'
import { cn } from '@/lib/utils'
import { fetchSharedList, publishSharedList, type SharedSnapshot } from '@/services/shareService'
import type { Task, TaskStatus } from '@/types'

export function SharedListView({ token }: { token: string }) {
  const [snapshot, setSnapshot] = useState<SharedSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchSharedList(token).then((data) => {
      if (!active) return
      setSnapshot(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [token])

  if (loading) {
    return <p className="p-6 text-sm text-muted-foreground">Cargando lista...</p>
  }

  if (!snapshot) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-xl font-semibold">Enlace no disponible</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          El enlace no es válido o la lista ha dejado de compartirse.
        </p>
      </main>
    )
  }

  const readOnly = snapshot.list.sharedMode !== 'read-write'

  async function toggleTask(task: Task) {
    if (!snapshot || readOnly) return
    const tasks = snapshot.tasks.map((item) => {
      if (item.id !== task.id) return item
      const status: TaskStatus = item.status === 'completed' ? 'todo' : 'completed'
      return { ...item, status }
    })
    const next: SharedSnapshot = { ...snapshot, tasks, updatedAt: new Date().toISOString() }
    setSnapshot(next)
    await publishSharedList(next)
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <header>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Lista compartida</p>
        <h1 className="text-2xl font-semibold">{snapshot.list.name}</h1>
        <p className="text-sm text-muted-foreground">
          {readOnly ? 'Solo lectura' : 'Lectura y escritura'} · {snapshot.tasks.length} tareas
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {snapshot.tasks.map((task) => {
          const completed = task.status === 'completed'
          return (
            <li
              key={task.id}
              className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-shadow hover:shadow-sm"
            >
              <input
                type="checkbox"
                className="mt-1 size-4 accent-primary"
                checked={completed}
                disabled={readOnly}
                aria-label={completed ? `Reabrir ${task.title}` : `Completar ${task.title}`}
                onChange={() => toggleTask(task)}
              />
              <div className="min-w-0 flex-1">
                <p className={cn('font-medium', completed && 'text-muted-foreground line-through')}>
                  {task.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <PriorityBadge priority={task.priority} />
                  {task.dueDate && <span>Vence: {formatDate(task.dueDate)}</span>}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
