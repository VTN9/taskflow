import { z } from 'zod'

export const themeSchema = z.enum(['light', 'dark', 'system'])
export const taskStatusSchema = z.enum(['todo', 'in-progress', 'completed', 'trashed'])
export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])
export const listTypeSchema = z.enum(['personal', 'professional'])
export const sharedModeSchema = z.enum(['private', 'read-only', 'read-write'])

export const userSettingsSchema = z.object({
  theme: themeSchema,
  notificationsEnabled: z.boolean(),
  soundEnabled: z.boolean(),
})

export const userSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  settings: userSettingsSchema,
})

export const taskListSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre de la lista es obligatorio'),
  type: listTypeSchema,
  sharedMode: sharedModeSchema,
  shareToken: z.string().optional(),
})

export const taskSchema = z.object({
  id: z.string(),
  listId: z.string(),
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  category: z.string(),
  tags: z.array(z.string()),
  dueDate: z.string().optional(),
  reminder: z.string().optional(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  color: z.string().min(1),
})

export const appStateSchema = z.object({
  user: userSchema,
  lists: z.array(taskListSchema),
  tasks: z.array(taskSchema),
  tags: z.array(tagSchema),
})

export const newTaskInputSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  priority: taskPrioritySchema.optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  reminder: z.string().optional(),
})
