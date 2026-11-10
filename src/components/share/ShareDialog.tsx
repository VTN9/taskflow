import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { sharedModeLabels } from '@/lib/labels'
import { createShareToken, publishSharedList } from '@/services/shareService'
import { selectTasksByList } from '@/store/selectors'
import { useTaskStore } from '@/store/taskStore'
import { SHARED_MODES, type SharedMode, type TaskList } from '@/types'

interface ShareDialogProps {
  list: TaskList
  onClose: () => void
}

export function ShareDialog({ list, onClose }: ShareDialogProps) {
  const tasks = useTaskStore((state) => state.tasks)
  const updateList = useTaskStore((state) => state.updateList)
  const [mode, setMode] = useState<SharedMode>(list.sharedMode)
  const [link, setLink] = useState('')

  async function generateLink() {
    const token = list.shareToken ?? createShareToken()
    const sharedList = { ...list, sharedMode: mode, shareToken: token }
    updateList(list.id, { sharedMode: mode, shareToken: token })
    await publishSharedList({
      list: sharedList,
      tasks: selectTasksByList(tasks, list.id),
      updatedAt: new Date().toISOString(),
    })
    setLink(`${window.location.origin}${window.location.pathname}?share=${token}`)
    toast.success('Enlace de compartición listo')
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Enlace copiado')
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compartir lista"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-md rounded-lg border bg-card p-5 shadow-lg">
        <h2 className="text-lg font-semibold">Compartir «{list.name}»</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Genera un enlace para compartir esta lista en tiempo real.
        </p>

        <label htmlFor="share-mode" className="mt-4 block text-sm font-medium">
          Modo de compartición
        </label>
        <select
          id="share-mode"
          value={mode}
          onChange={(event) => setMode(event.target.value as SharedMode)}
          className="mt-1 h-9 w-full rounded-md border bg-transparent px-3 text-sm"
        >
          {SHARED_MODES.map((item) => (
            <option key={item} value={item}>
              {sharedModeLabels[item]}
            </option>
          ))}
        </select>

        {link && (
          <div className="mt-4 flex flex-col gap-1">
            <label htmlFor="share-link" className="text-sm font-medium">
              Enlace para compartir
            </label>
            <Input id="share-link" readOnly value={link} onFocus={(event) => event.target.select()} />
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          {link ? (
            <Button type="button" onClick={copyLink}>
              Copiar enlace
            </Button>
          ) : (
            <Button type="button" onClick={generateLink}>
              Generar enlace
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
