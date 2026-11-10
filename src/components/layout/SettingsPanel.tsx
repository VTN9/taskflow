import { toast } from 'sonner'
import { notificationsSupported, requestNotificationPermission } from '@/lib/notifications'
import { useTaskStore } from '@/store/taskStore'

export function SettingsPanel() {
  const settings = useTaskStore((state) => state.user.settings)
  const updateSettings = useTaskStore((state) => state.updateSettings)

  async function toggleNotifications(enabled: boolean) {
    if (enabled) {
      const permission = await requestNotificationPermission()
      if (permission !== 'granted') {
        toast.error('Permiso de notificaciones denegado')
        updateSettings({ notificationsEnabled: false })
        return
      }
    }
    updateSettings({ notificationsEnabled: enabled })
  }

  return (
    <fieldset className="flex flex-col gap-2 text-sm">
      <legend className="mb-1 font-medium">Ajustes</legend>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={settings.notificationsEnabled}
          disabled={!notificationsSupported()}
          onChange={(event) => void toggleNotifications(event.target.checked)}
        />
        Notificaciones
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={settings.soundEnabled}
          onChange={(event) => updateSettings({ soundEnabled: event.target.checked })}
        />
        Sonido
      </label>
    </fieldset>
  )
}
