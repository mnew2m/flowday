import { parseISO, differenceInCalendarDays, subDays, format } from 'date-fns'
import type { HabitCompletion, Habit } from '../types'
import { getDay } from 'date-fns'

export function calculateStreak(completions: HabitCompletion[], habit: Habit): {
  current: number
  longest: number
} {
  if (completions.length === 0) return { current: 0, longest: 0 }

  const dates = completions
    .map(c => c.completedDate)
    .sort()
    .reverse()

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  // Current streak
  let current = 0
  let checkDate = dates[0] === today || dates[0] === yesterday ? dates[0] : null

  if (checkDate) {
    const dateSet = new Set(dates)
    let d = parseISO(checkDate)
    while (true) {
      const key = format(d, 'yyyy-MM-dd')
      if (!dateSet.has(key)) {
        // check if this day is required
        if (isDayRequired(habit, d)) break
      } else {
        current++
      }
      d = subDays(d, 1)
      if (differenceInCalendarDays(new Date(), d) > 365) break
    }
  }

  // Longest streak
  let longest = 0
  let streak = 1
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = differenceInCalendarDays(parseISO(dates[i]), parseISO(dates[i + 1]))
    if (diff === 1) {
      streak++
      if (streak > longest) longest = streak
    } else {
      streak = 1
    }
  }
  if (dates.length === 1) longest = 1
  if (streak > longest) longest = streak

  return { current, longest }
}

function isDayRequired(habit: Habit, date: Date): boolean {
  if (habit.recurrence.type === 'daily') return true
  if (habit.recurrence.type === 'weekly' && habit.recurrence.daysOfWeek) {
    return habit.recurrence.daysOfWeek.includes(getDay(date))
  }
  return true
}

export function getLast7DaysStatus(completions: HabitCompletion[], habit: Habit): { date: string; completed: boolean; required: boolean }[] {
  const result = []
  const completionSet = new Set(completions.map(c => c.completedDate))

  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i)
    const key = format(d, 'yyyy-MM-dd')
    result.push({
      date: key,
      completed: completionSet.has(key),
      required: isDayRequired(habit, d),
    })
  }
  return result
}
