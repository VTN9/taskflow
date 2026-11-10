import { useEffect } from 'react'
import { useTaskStore } from '@/store/taskStore'
import type { Theme } from '@/types'

export function useTheme() {
  const theme = useTaskStore((state) => state.user.settings.theme)
  const updateSettings = useTaskStore((state) => state.updateSettings)

  useEffect(() => {
    const root = document.documentElement
    const apply = (dark: boolean) => root.classList.toggle('dark', dark)

    if (theme === 'system') {
      if (typeof window.matchMedia !== 'function') {
        apply(false)
        return
      }
      const query = window.matchMedia('(prefers-color-scheme: dark)')
      apply(query.matches)
      const listener = (event: MediaQueryListEvent) => apply(event.matches)
      query.addEventListener('change', listener)
      return () => query.removeEventListener('change', listener)
    }

    apply(theme === 'dark')
  }, [theme])

  return { theme, setTheme: (next: Theme) => updateSettings({ theme: next }) }
}
