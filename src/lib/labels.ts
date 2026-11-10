import type { ListType, TaskPriority, TaskStatus } from '@/types'

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
}

export const statusLabels: Record<TaskStatus, string> = {
  todo: 'Pendiente',
  'in-progress': 'En curso',
  completed: 'Completada',
  trashed: 'Papelera',
}

export const listTypeLabels: Record<ListType, string> = {
  personal: 'Personal',
  professional: 'Profesional',
}
