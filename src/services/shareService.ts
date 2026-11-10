import type { Task, TaskList } from '@/types'

export interface SharedSnapshot {
  list: TaskList
  tasks: Task[]
  updatedAt: string
}

const STORAGE_PREFIX = 'taskflow-share-'
const apiUrl = import.meta.env.VITE_SHARE_API_URL as string | undefined

function storageKey(token: string) {
  return `${STORAGE_PREFIX}${token}`
}

export function createShareToken(): string {
  const random = Math.random().toString(36).slice(2, 10)
  return `pub-${random}`
}

export async function publishSharedList(snapshot: SharedSnapshot): Promise<void> {
  const token = snapshot.list.shareToken
  if (!token) return

  if (apiUrl) {
    await fetch(`${apiUrl}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
    })
    return
  }

  localStorage.setItem(storageKey(token), JSON.stringify(snapshot))
}

export async function fetchSharedList(token: string): Promise<SharedSnapshot | null> {
  try {
    if (apiUrl) {
      const response = await fetch(`${apiUrl}?token=${encodeURIComponent(token)}`)
      if (!response.ok) return null
      return (await response.json()) as SharedSnapshot
    }

    const raw = localStorage.getItem(storageKey(token))
    return raw ? (JSON.parse(raw) as SharedSnapshot) : null
  } catch {
    return null
  }
}
