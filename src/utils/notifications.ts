import { parseISO } from 'date-fns'

// Capacitor Local Notifications - lazy import for web compatibility
async function getNotifications() {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications')
    return LocalNotifications
  } catch {
    return null
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  const ln = await getNotifications()
  if (!ln) return false
  const { display } = await ln.requestPermissions()
  return display === 'granted'
}

export async function scheduleNotification(options: {
  id: number
  title: string
  body: string
  at: string
}): Promise<void> {
  const ln = await getNotifications()
  if (!ln) return
  await ln.schedule({
    notifications: [{
      id: options.id,
      title: options.title,
      body: options.body,
      schedule: { at: parseISO(options.at) },
      sound: undefined,
      attachments: undefined,
      actionTypeId: '',
      extra: null,
    }],
  })
}

export async function cancelNotification(id: number): Promise<void> {
  const ln = await getNotifications()
  if (!ln) return
  await ln.cancel({ notifications: [{ id }] })
}
