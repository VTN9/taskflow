import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTaskStore } from '@/store/taskStore'

const palette = ['#61DAFB', '#38BDF8', '#F472B6', '#FBBF24', '#34D399', '#A78BFA']

interface TagPickerProps {
  value: string[]
  onChange: (ids: string[]) => void
}

export function TagPicker({ value, onChange }: TagPickerProps) {
  const tags = useTaskStore((state) => state.tags)
  const addTag = useTaskStore((state) => state.addTag)
  const [name, setName] = useState('')

  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id])
  }

  const createTag = () => {
    if (!name.trim()) return
    const id = addTag(name, palette[tags.length % palette.length])
    onChange([...value, id])
    setName('')
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium">Etiquetas</legend>

      <div className="flex flex-wrap gap-3">
        {tags.length === 0 && (
          <span className="text-sm text-muted-foreground">Todavía no hay etiquetas.</span>
        )}
        {tags.map((tag) => (
          <label key={tag.id} className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={value.includes(tag.id)}
              onChange={() => toggle(tag.id)}
            />
            <span style={{ color: tag.color }}>{tag.name}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          aria-label="Nueva etiqueta"
          placeholder="Nueva etiqueta"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="button" size="sm" variant="outline" onClick={createTag}>
          <Plus className="size-4" aria-hidden="true" />
          Añadir
        </Button>
      </div>
    </fieldset>
  )
}
