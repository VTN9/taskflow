import { beforeEach, describe, expect, it } from 'vitest'
import {
  createShareToken,
  fetchSharedList,
  publishSharedList,
  type SharedSnapshot,
} from './shareService'

const snapshot: SharedSnapshot = {
  list: {
    id: 'list-1',
    name: 'Trabajo',
    type: 'professional',
    sharedMode: 'read-only',
    shareToken: 'pub-test',
  },
  tasks: [],
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  localStorage.clear()
})

describe('shareService', () => {
  it('genera tokens con prefijo pub-', () => {
    expect(createShareToken()).toMatch(/^pub-[a-z0-9]{8}$/)
  })

  it('publica y recupera una instantánea', async () => {
    await publishSharedList(snapshot)
    expect(await fetchSharedList('pub-test')).toEqual(snapshot)
  })

  it('devuelve null si el token no existe', async () => {
    expect(await fetchSharedList('pub-inexistente')).toBeNull()
  })
})
