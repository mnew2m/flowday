import { useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useHabits } from '../hooks/useHabits'
import { useCategories } from '../hooks/useCategories'
import { useStats } from '../hooks/useStats'
import { CompletionChart } from '../components/stats/CompletionChart'
import { StreakSummary } from '../components/stats/StreakSummary'

type Period = 'week' | 'month'

export function StatsPage() {
  const { todos } = useTodos()
  const { habits, completions, getCompletionsForHabit } = useHabits()
  const { categories } = useCategories()
  const { weeklyTodoStats, monthlyTodoStats, habitWeeklyStats, overallStats } = useStats(todos, habits, completions)
  const [period, setPeriod] = useState<Period>('week')

  return (
    <div className="pt-safe">
      <div className="px-5 pt-3 pb-4">
        <h1 className="text-[34px] font-bold text-primary tracking-[-0.5px] leading-tight">통계</h1>
      </div>

      <div className="px-4 space-y-3">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '할일 완료율', value: `${overallStats.todoRate}%`, sub: `${overallStats.completedTodos}/${overallStats.totalTodos} 완료` },
            { label: '이번 주 습관', value: `${overallStats.habitRate}%`, sub: `오늘 ${overallStats.todayCompletions}/${overallStats.totalHabits}` },
          ].map(card => (
            <div
              key={card.label}
              className="rounded-xl p-4 shadow-card"
              style={{ background: 'var(--color-card)' }}
            >
              <p className="text-[12px] text-secondary font-medium">{card.label}</p>
              <p className="text-[28px] font-bold tracking-[-0.5px] mt-0.5" style={{ color: 'var(--color-accent)' }}>
                {card.value}
              </p>
              <p className="text-[12px] text-muted mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Period toggle */}
        <div
          className="flex p-1 rounded-lg"
          style={{ background: 'var(--color-fill)' }}
        >
          {(['week', 'month'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="flex-1 py-1.5 rounded-md text-[13px] font-medium transition-all active:opacity-70"
              style={
                period === p
                  ? { background: 'var(--color-card)', color: 'var(--color-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }
                  : { color: 'var(--color-muted)' }
              }
            >
              {p === 'week' ? '주간' : '월간'}
            </button>
          ))}
        </div>

        <CompletionChart
          data={period === 'week' ? weeklyTodoStats : monthlyTodoStats}
          title={`${period === 'week' ? '주간' : '월간'} 할일 완료율`}
        />
        <CompletionChart data={habitWeeklyStats} title="이번 주 습관 완료율" />
        <StreakSummary habits={habits} categories={categories} getCompletions={getCompletionsForHabit} />
      </div>

      <div className="h-6" />
    </div>
  )
}
