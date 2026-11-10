import { ListTodo, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/taskStore'
import { selectPendingCount } from '@/store/selectors'
import type { Task, TaskList } from '@/types'
import { ThemeToggle } from './ThemeToggle'

interface SidebarProps {
  lists: TaskList[]
  tasks: Task[]
  activeListId: string | null
  view: 'tasks' | 'trash'
  onSelectList: (id: string) => void
  onShowTrash: () => void
}

export function Sidebar({
  lists,
  tasks,
  activeListId,
  view,
  onSelectList,
  onShowTrash,
}: SidebarProps) {
  const addList = useTaskStore((state) => state.addList)
  const [name, setName] = useState('')

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-b bg-card/40 p-4 md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-1">
        <ListTodo className="size-6 text-primary" aria-hidden="true" />
        <h1 className="text-lg font-semibold tracking-tight">TaskFlow</h1>
      </div>

      <nav aria-label="Listas de tareas" className="flex flex-1 flex-col gap-1">
        {lists.map((list) => {
          const pending = selectPendingCount(tasks, list.id)
          const active = view === 'tasks' && list.id === activeListId
          return (
            <button
              key={list.id}
              type="button"
              onClick={() => onSelectList(list.id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                active && 'bg-accent text-accent-foreground',
              )}
            >
              <span className="truncate">{list.name}</span>
              <span className="text-xs text-muted-foreground">{pending}</span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={onShowTrash}
          aria-current={view === 'trash' ? 'page' : undefined}
          className={cn(
            'mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            view === 'trash' && 'bg-accent text-accent-foreground',
          )}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Papelera
        </button>
      </nav>

      <ThemeToggle />

      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          if (!name.trim()) return
          const id = addList(name)
          setName('')
          onSelectList(id)
        }}
      >
        <Input
          aria-label="Nombre de la nueva lista"
          placeholder="Nueva lista"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="submit" size="icon" aria-label="Añadir lista">
          <Plus className="size-4" aria-hidden="true" />
        </Button>
      </form>
    </aside>
  )
}
