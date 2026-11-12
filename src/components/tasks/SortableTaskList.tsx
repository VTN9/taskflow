import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { reorderWithinFullList } from '@/lib/reorder'
import { useTaskStore } from '@/store/taskStore'
import { selectTasksByList } from '@/store/selectors'
import type { Task } from '@/types'
import { SortableTaskItem } from './SortableTaskItem'

export function SortableTaskList({ tasks, listId }: { tasks: Task[]; listId: string }) {
  const allTasks = useTaskStore((state) => state.tasks)
  const reorderTasks = useTaskStore((state) => state.reorderTasks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const ids = tasks.map((task) => task.id)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(String(active.id))
    const newIndex = ids.indexOf(String(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    const fullOrder = selectTasksByList(allTasks, listId).map((task) => task.id)
    reorderTasks(listId, reorderWithinFullList(fullOrder, ids, oldIndex, newIndex))
  }

  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay tareas con estos filtros.
      </p>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <SortableTaskItem key={task.id} task={task} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
