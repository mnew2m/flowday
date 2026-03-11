import { useMemo } from 'react'
import { subDays, format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import type { Todo, Habit, HabitCompletion, StatsData } from '../types'

export function useStats(todos: Todo[], habits: Habit[], completions: HabitCompletion[]) {
  const weeklyTodoStats = useMemo((): StatsData[] => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayTodos = todos.filter(t => t.dueDate?.startsWith(dateStr))
      const completed = dayTodos.filter(t => t.completed).length
      const total = dayTodos.length
      return {
        date: format(date, 'M/d'),
        completed,
        total,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })
  }, [todos])

  const monthlyTodoStats = useMemo((): StatsData[] => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayTodos = todos.filter(t => t.dueDate?.startsWith(dateStr))
      const completed = dayTodos.filter(t => t.completed).length
      const total = dayTodos.length
      return {
        date: format(date, 'M/d'),
        completed,
        total,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })
  }, [todos])

  const habitWeeklyStats = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const end = endOfWeek(new Date(), { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start, end })
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const activeHabits = habits.filter(h => !h.archived)
      const completed = completions.filter(c => c.completedDate === dateStr).length
      return {
        date: format(day, 'E'),
        completed,
        total: activeHabits.length,
        rate: activeHabits.length > 0 ? Math.round((completed / activeHabits.length) * 100) : 0,
      }
    })
  }, [habits, completions])

  const overallStats = useMemo(() => {
    const totalTodos = todos.length
    const completedTodos = todos.filter(t => t.completed).length
    const totalHabits = habits.filter(h => !h.archived).length
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const todayCompletions = completions.filter(c => c.completedDate === todayStr).length

    // Calculate total completion rate for past 7 days
    const past7 = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'))
    const recentCompletions = completions.filter(c => past7.includes(c.completedDate))
    const maxPossible = totalHabits * 7
    const habitRate = maxPossible > 0 ? Math.round((recentCompletions.length / maxPossible) * 100) : 0

    return {
      totalTodos,
      completedTodos,
      todoRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
      totalHabits,
      todayCompletions,
      habitRate,
    }
  }, [todos, habits, completions])

  const completedTodosCount = todos.filter(t => {
    if (!t.completedAt) return false
    const today = format(new Date(), 'yyyy-MM-dd')
    return parseISO(t.completedAt).toISOString().startsWith(today)
  }).length

  return { weeklyTodoStats, monthlyTodoStats, habitWeeklyStats, overallStats, completedTodosCount }
}
