import { addDays, addWeeks, addMonths, isSameDay, parseISO, getDay } from 'date-fns'
import type { Recurrence, Todo } from '../types'

export function getNextOccurrence(recurrence: Recurrence, fromDate: Date): Date | null {
  if (recurrence.type === 'none') return null
  if (recurrence.endDate && new Date(recurrence.endDate) < fromDate) return null

  const interval = recurrence.interval || 1

  switch (recurrence.type) {
    case 'daily':
      return addDays(fromDate, interval)
    case 'weekly': {
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        // find next matching day of week
        let next = addDays(fromDate, 1)
        for (let i = 0; i < 14; i++) {
          if (recurrence.daysOfWeek.includes(getDay(next))) return next
          next = addDays(next, 1)
        }
        return null
      }
      return addWeeks(fromDate, interval)
    }
    case 'monthly': {
      const next = addMonths(fromDate, interval)
      if (recurrence.dayOfMonth) {
        next.setDate(recurrence.dayOfMonth)
      }
      return next
    }
    case 'custom':
      return addDays(fromDate, interval)
    default:
      return null
  }
}

export function isRecurringToday(recurrence: Recurrence, createdAt: string): boolean {
  if (recurrence.type === 'none') return false
  const today = new Date()
  const created = parseISO(createdAt)

  if (recurrence.endDate && today > parseISO(recurrence.endDate)) return false

  switch (recurrence.type) {
    case 'daily':
      return true
    case 'weekly':
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        return recurrence.daysOfWeek.includes(getDay(today))
      }
      return isSameDay(addWeeks(created, Math.ceil((today.getTime() - created.getTime()) / (7 * 24 * 60 * 60 * 1000))), today)
    case 'monthly':
      if (recurrence.dayOfMonth) return today.getDate() === recurrence.dayOfMonth
      return today.getDate() === created.getDate()
    case 'custom':
      return true
    default:
      return false
  }
}

export function buildNextTodo(todo: Todo): Omit<Todo, 'id' | 'createdAt'> {
  const fromDate = todo.dueDate ? parseISO(todo.dueDate) : new Date()
  const nextDate = getNextOccurrence(todo.recurrence, fromDate)

  return {
    userId: todo.userId,
    categoryId: todo.categoryId,
    title: todo.title,
    description: todo.description,
    completed: false,
    dueDate: nextDate?.toISOString(),
    reminderTime: undefined,
    recurrence: todo.recurrence,
    parentId: todo.parentId ?? todo.id,
    tags: todo.tags,
  }
}
