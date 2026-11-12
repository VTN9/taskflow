import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AppState,
  ListType,
  NewTaskInput,
  Task,
  TaskList,
  TaskStatus,
  UserSettings,
} from '@/types'

const now = () => new Date().toISOString()

const newId = (prefix: string) =>
  `${prefix}-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`

export function createInitialState(): AppState {
  return {
    user: {
      name: 'Usuario',
      settings: { theme: 'system', notificationsEnabled: true, soundEnabled: false },
    },
    lists: [
      { id: 'list-default', name: 'Mis tareas', type: 'personal', sharedMode: 'private' },
    ],
    tasks: [],
    tags: [],
  }
}

export type TaskPatch = Partial<
  Pick<
    Task,
    | 'title'
    | 'description'
    | 'status'
    | 'priority'
    | 'category'
    | 'tags'
    | 'dueDate'
    | 'reminder'
  >
>

interface TaskStore extends AppState {
  addList: (name: string, type?: ListType) => string
  updateList: (
    id: string,
    patch: Partial<Pick<TaskList, 'name' | 'type' | 'sharedMode' | 'shareToken'>>,
  ) => void
  removeList: (id: string) => void
  addTask: (listId: string, input: NewTaskInput) => string | null
  updateTask: (id: string, patch: TaskPatch) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
  restoreTask: (id: string) => void
  purgeTask: (id: string) => void
  reorderTasks: (listId: string, orderedIds: string[]) => void
  addTag: (name: string, color: string) => string
  removeTag: (id: string) => void
  updateSettings: (patch: Partial<UserSettings>) => void
  setUserName: (name: string) => void
  reset: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      addList: (name, type = 'personal') => {
        const id = newId('list')
        const list: TaskList = { id, name: name.trim(), type, sharedMode: 'private' }
        set((state) => ({ lists: [...state.lists, list] }))
        return id
      },

      updateList: (id, patch) =>
        set((state) => ({
          lists: state.lists.map((list) => (list.id === id ? { ...list, ...patch } : list)),
        })),

      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
          tasks: state.tasks.filter((task) => task.listId !== id),
        })),

      addTask: (listId, input) => {
        const list = get().lists.find((item) => item.id === listId)
        if (!list || !input.title.trim()) return null
        const id = newId('task')
        const maxOrder = get()
          .tasks.filter((task) => task.listId === listId)
          .reduce((max, task) => Math.max(max, task.order), 0)
        const task: Task = {
          id,
          listId,
          title: input.title.trim(),
          description: input.description ?? '',
          status: 'todo',
          priority: input.priority ?? 'medium',
          category: input.category ?? '',
          tags: input.tags ?? [],
          dueDate: input.dueDate,
          reminder: input.reminder,
          order: maxOrder + 1,
          createdAt: now(),
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
        return id
      },

      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...patch, updatedAt: now() } : task,
          ),
        })),

      setTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status, updatedAt: now() } : task,
          ),
        })),

      restoreTask: (id) => get().setTaskStatus(id, 'todo'),

      purgeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),

      reorderTasks: (listId, orderedIds) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.listId !== listId) return task
            const index = orderedIds.indexOf(task.id)
            return index === -1 ? task : { ...task, order: index + 1 }
          }),
        })),

      addTag: (name, color) => {
        const id = newId('tag')
        set((state) => ({ tags: [...state.tags, { id, name: name.trim(), color }] }))
        return id
      },

      removeTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          tasks: state.tasks.map((task) => ({
            ...task,
            tags: task.tags.filter((tagId) => tagId !== id),
          })),
        })),

      updateSettings: (patch) =>
        set((state) => ({
          user: { ...state.user, settings: { ...state.user.settings, ...patch } },
        })),

      setUserName: (name) =>
        set((state) => ({ user: { ...state.user, name: name.trim() || 'Usuario' } })),

      reset: () => set(createInitialState()),
    }),
    {
      name: 'taskflow-state',
      version: 1,
      partialize: (state) => ({
        user: state.user,
        lists: state.lists,
        tasks: state.tasks,
        tags: state.tags,
      }),
    },
  ),
)
