import { Input } from '@/components/ui/input'
import { priorityLabels, statusLabels } from '@/lib/labels'
import type { TaskFilters as Filters } from '@/lib/taskFilters'
import { TASK_PRIORITIES, type Tag, type TaskStatus } from '@/types'

const statusOptions: TaskStatus[] = ['todo', 'in-progress', 'completed']

interface TaskFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
  tags: Tag[]
}

const selectClass = 'h-9 rounded-md border bg-transparent px-3 text-sm'

export function TaskFilters({ filters, onChange, tags }: TaskFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filtros de tareas"
      className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
    >
      <Input
        aria-label="Buscar tareas"
        placeholder="Buscar..."
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
      />

      <select
        aria-label="Filtrar por estado"
        className={selectClass}
        value={filters.status}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as Filters['status'] })
        }
      >
        <option value="all">Todos los estados</option>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por prioridad"
        className={selectClass}
        value={filters.priority}
        onChange={(event) =>
          onChange({ ...filters, priority: event.target.value as Filters['priority'] })
        }
      >
        <option value="all">Todas las prioridades</option>
        {TASK_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {priorityLabels[priority]}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por etiqueta"
        className={selectClass}
        value={filters.tagId}
        onChange={(event) => onChange({ ...filters, tagId: event.target.value })}
      >
        <option value="all">Todas las etiquetas</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Ordenar tareas"
        className={selectClass}
        value={filters.sort}
        onChange={(event) => onChange({ ...filters, sort: event.target.value as Filters['sort'] })}
      >
        <option value="order">Orden manual</option>
        <option value="dueDate">Fecha límite</option>
      </select>
    </div>
  )
}
