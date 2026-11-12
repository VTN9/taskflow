export type Theme = 'light' | 'dark' | 'system'
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'trashed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ListType = 'personal' | 'professional'
export type SharedMode = 'private' | 'read-only' | 'read-write'

export interface UserSettings {
  theme: Theme
  notificationsEnabled: boolean
  soundEnabled: boolean
}

export interface User {
  name: string
  settings: UserSettings
}

export interface TaskList {
  id: string
  name: string
  type: ListType
  sharedMode: SharedMode
  shareToken?: string
}

export interface Task {
  id: string
  listId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  category: string
  tags: string[]
  dueDate?: string
  reminder?: string
  order: number
  createdAt: string
  updatedAt?: string
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface AppState {
  user: User
  lists: TaskList[]
  tasks: Task[]
  tags: Tag[]
}

export type NewTaskInput = {
  title: string
  description?: string
  priority?: TaskPriority
  category?: string
  tags?: string[]
  dueDate?: string
  reminder?: string
}

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'completed', 'trashed']
export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent']
export const LIST_TYPES: ListType[] = ['personal', 'professional']
export const SHARED_MODES: SharedMode[] = ['private', 'read-only', 'read-write']
export const THEMES: Theme[] = ['light', 'dark', 'system']
