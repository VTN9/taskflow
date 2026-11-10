import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createInitialState, useTaskStore } from '@/store/taskStore'
import { ShareDialog } from './ShareDialog'

beforeEach(() => {
  localStorage.clear()
  useTaskStore.setState(createInitialState())
})

describe('ShareDialog', () => {
  it('genera un enlace y actualiza la lista', async () => {
    const user = userEvent.setup()
    const list = useTaskStore.getState().lists[0]
    render(<ShareDialog list={list} onClose={vi.fn()} />)

    await user.selectOptions(screen.getByLabelText(/modo de compartición/i), 'read-only')
    await user.click(screen.getByRole('button', { name: /generar enlace/i }))

    const updated = useTaskStore.getState().lists[0]
    expect(updated.sharedMode).toBe('read-only')
    expect(updated.shareToken).toMatch(/^pub-/)
    const input = await screen.findByLabelText(/enlace para compartir/i)
    expect((input as HTMLInputElement).value).toContain('?share=')
  })

  it('permite cerrar el diálogo', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<ShareDialog list={useTaskStore.getState().lists[0]} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
