import { useEffect } from 'react'
import { toast } from 'sonner'
import { showNotification } from '@/lib/notifications'
import { collectUpcomingReminders } from '@/lib/reminders'
import { playBeep } from '@/lib/sound'
import { useTaskStore } from '@/store/taskStore'

const HORIZON_MS = 24 * 60 * 60 * 1000

export function useReminders() {
  const tasks = useTaskStore((state) => state.tasks)
  const notificationsEnabled = useTaskStore((state) => state.user.settings.notificationsEnabled)
  const soundEnabled = useTaskStore((state) => state.user.settings.soundEnabled)

  useEffect(() => {
    const now = Date.now()
    const timers = collectUpcomingReminders(tasks, now, HORIZON_MS).map(({ task, time }) =>
      window.setTimeout(() => {
        if (notificationsEnabled) {
          showNotification(task.title, task.description || 'Es hora de tu tarea')
        }
        if (soundEnabled) playBeep()
        toast.info(`Recordatorio: ${task.title}`)
      }, time - now),
    )

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [tasks, notificationsEnabled, soundEnabled])
}
