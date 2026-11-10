import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { TaskBoard } from '@/components/tasks/TaskBoard'
import { TrashList } from '@/components/tasks/TrashList'
import { useTaskStore } from '@/store/taskStore'

function App() {
  const lists = useTaskStore((state) => state.lists)
  const tasks = useTaskStore((state) => state.tasks)
  const [activeListId, setActiveListId] = useState<string | null>(lists[0]?.id ?? null)
  const [view, setView] = useState<'tasks' | 'trash'>('tasks')

  const currentListId = lists.some((list) => list.id === activeListId)
    ? activeListId
    : (lists[0]?.id ?? null)

  return (
    <div className="flex min-h-svh">
      <Sidebar
        lists={lists}
        tasks={tasks}
        activeListId={currentListId}
        view={view}
        onSelectList={(id) => {
          setActiveListId(id)
          setView('tasks')
        }}
        onShowTrash={() => setView('trash')}
      />

      <main className="flex-1 p-6">
        {view === 'trash' ? (
          <TrashList />
        ) : currentListId ? (
          <TaskBoard listId={currentListId} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay listas. Crea una para empezar.
          </p>
        )}
      </main>
    </div>
  )
}

export default App
