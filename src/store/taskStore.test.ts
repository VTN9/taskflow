import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialState, useTaskStore } from './taskStore'

const get = () => useTaskStore.getState()

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
})

describe('taskStore: listas', () => {
  it('crea una lista con valores por defecto', () => {
    const id = get().addList('Trabajo', 'professional')
    const list = get().lists.find((item) => item.id === id)
    expect(list).toMatchObject({ name: 'Trabajo', type: 'professional', sharedMode: 'private' })
  })

  it('actualiza una lista', () => {
    const id = get().addList('Trabajo')
    get().updateList(id, { name: 'Oficina', sharedMode: 'read-only' })
    expect(get().lists.find((item) => item.id === id)).toMatchObject({
      name: 'Oficina',
      sharedMode: 'read-only',
    })
  })

  it('elimina una lista y sus tareas', () => {
    const id = get().addList('Trabajo')
    get().addTask(id, { title: 'Tarea' })
    get().removeList(id)
    expect(get().lists.find((item) => item.id === id)).toBeUndefined()
    expect(get().tasks.some((task) => task.listId === id)).toBe(false)
  })
})

describe('taskStore: tareas', () => {
  it('crea una tarea con orden incremental', () => {
    const listId = get().addList('Trabajo')
    const first = get().addTask(listId, { title: 'Primera' })
    const second = get().addTask(listId, { title: 'Segunda' })
    expect(first).not.toBeNull()
    expect(get().tasks.find((task) => task.id === second)?.order).toBe(2)
  })

  it('no crea tareas con título vacío ni listas inexistentes', () => {
    const listId = get().addList('Trabajo')
    expect(get().addTask(listId, { title: '   ' })).toBeNull()
    expect(get().addTask('no-existe', { title: 'X' })).toBeNull()
  })

  it('actualiza una tarea y marca updatedAt', () => {
    const listId = get().addList('Trabajo')
    const id = get().addTask(listId, { title: 'Tarea' })!
    get().updateTask(id, { title: 'Editada', priority: 'urgent' })
    const task = get().tasks.find((item) => item.id === id)
    expect(task).toMatchObject({ title: 'Editada', priority: 'urgent' })
    expect(task?.updatedAt).toBeDefined()
  })

  it('mueve a la papelera y restaura', () => {
    const listId = get().addList('Trabajo')
    const id = get().addTask(listId, { title: 'Tarea' })!
    get().setTaskStatus(id, 'trashed')
    expect(get().tasks.find((task) => task.id === id)?.status).toBe('trashed')
    get().restoreTask(id)
    expect(get().tasks.find((task) => task.id === id)?.status).toBe('todo')
  })

  it('purga una tarea definitivamente', () => {
    const listId = get().addList('Trabajo')
    const id = get().addTask(listId, { title: 'Tarea' })!
    get().purgeTask(id)
    expect(get().tasks.find((task) => task.id === id)).toBeUndefined()
  })

  it('reordena tareas de una lista', () => {
    const listId = get().addList('Trabajo')
    const a = get().addTask(listId, { title: 'A' })!
    const b = get().addTask(listId, { title: 'B' })!
    get().reorderTasks(listId, [b, a])
    expect(get().tasks.find((task) => task.id === b)?.order).toBe(1)
    expect(get().tasks.find((task) => task.id === a)?.order).toBe(2)
  })
})

describe('taskStore: tags y ajustes', () => {
  it('crea y elimina tags de las tareas', () => {
    const listId = get().addList('Trabajo')
    const tagId = get().addTag('react', '#61DAFB')
    const taskId = get().addTask(listId, { title: 'Tarea', tags: [tagId] })!
    get().removeTag(tagId)
    expect(get().tags).toHaveLength(0)
    expect(get().tasks.find((task) => task.id === taskId)?.tags).toHaveLength(0)
  })

  it('actualiza ajustes y nombre de usuario', () => {
    get().updateSettings({ theme: 'dark', soundEnabled: true })
    get().setUserName('Ana')
    expect(get().user.name).toBe('Ana')
    expect(get().user.settings).toMatchObject({ theme: 'dark', soundEnabled: true })
  })

  it('restablece el estado inicial', () => {
    get().addList('Temporal')
    get().reset()
    expect(get().lists).toHaveLength(1)
    expect(get().tasks).toHaveLength(0)
  })
})
