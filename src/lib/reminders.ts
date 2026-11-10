import type { Task } from '@/types'

export interface ReminderEntry {
  task: Task
  time: number
}

export function collectUpcomingReminders(
  tasks: Task[],
  from: number,
  horizonMs: number,
): ReminderEntry[] {
  return tasks
    .filter((task) => task.reminder && task.status !== 'completed' && task.status !== 'trashed')
    .map((task) => ({ task, time: new Date(task.reminder as string).getTime() }))
    .filter((entry) => !Number.isNaN(entry.time) && entry.time > from && entry.time - from <= horizonMs)
    .sort((a, b) => a.time - b.time)
}
