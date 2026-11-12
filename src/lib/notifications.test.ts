import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  notificationsSupported,
  requestNotificationPermission,
  showNotification,
} from './notifications'

class MockNotification {
  static permission: NotificationPermission = 'default'
  static requestPermission = vi.fn(async () => MockNotification.permission)
  title: string
  options?: NotificationOptions

  constructor(title: string, options?: NotificationOptions) {
    this.title = title
    this.options = options
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  MockNotification.permission = 'default'
  MockNotification.requestPermission.mockClear()
})

describe('notifications', () => {
  it('detecta si la API está disponible', () => {
    vi.stubGlobal('Notification', MockNotification)
    expect(notificationsSupported()).toBe(true)
  })

  it('solicita permiso cuando está pendiente', async () => {
    vi.stubGlobal('Notification', MockNotification)
    MockNotification.permission = 'granted'
    expect(await requestNotificationPermission()).toBe('granted')
  })

  it('muestra una notificación con permiso concedido', () => {
    vi.stubGlobal('Notification', MockNotification)
    MockNotification.permission = 'granted'
    expect(showNotification('Hola', 'Mundo')).toBe(true)
  })

  it('no muestra notificación sin permiso', () => {
    vi.stubGlobal('Notification', MockNotification)
    MockNotification.permission = 'denied'
    expect(showNotification('Hola', 'Mundo')).toBe(false)
  })
})
