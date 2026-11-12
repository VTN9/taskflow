import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { publishSharedList } from '@/services/shareService'
import type { SharedSnapshot } from '@/services/shareService'
import { SharedListView } from './SharedListView'

const snapshot: SharedSnapshot = {
  list: {
    id: 'list-1',
    name: 'Proyecto compartido',
    type: 'professional',
    sharedMode: 'read-only',
    shareToken: 'pub-view',
  },
  tasks: [
    {
      id: 'task-1',
      listId: 'list-1',
      title: 'Revisar propuesta',
      description: '',
      status: 'todo',
      priority: 'high',
      category: '',
      tags: [],
      order: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(async () => {
  localStorage.clear()
  await publishSharedList(snapshot)
})

describe('SharedListView', () => {
  it('muestra la lista compartida en solo lectura', async () => {
    render(<SharedListView token="pub-view" />)
    expect(await screen.findByRole('heading', { name: /proyecto compartido/i })).toBeInTheDocument()
    expect(screen.getByText('Revisar propuesta')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('muestra un mensaje si el enlace no existe', async () => {
    render(<SharedListView token="pub-missing" />)
    expect(await screen.findByText(/enlace no disponible/i)).toBeInTheDocument()
  })
})
