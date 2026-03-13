import type { Habit, HabitCompletion, Category } from '../../types'
import { calculateStreak } from '../../utils/streaks'

const DEFAULT_COLOR = '#7c3aed'

interface StreakSummaryProps {
  habits: Habit[]
  categories: Category[]
  getCompletions: (habitId: string) => HabitCompletion[]
}

export function StreakSummary({ habits, categories, getCompletions }: StreakSummaryProps) {
  const activeHabits = habits.filter(h => !h.archived)

  const streaks = activeHabits.map(h => ({
    habit: h,
    ...calculateStreak(getCompletions(h.id), h),
  }))

  const topByLongest = [...streaks].sort((a, b) => b.longest - a.longest).slice(0, 5)
  const maxLongest = Math.max(...streaks.map(s => s.longest), 1)

  return (
    <div className="p-4 bg-card rounded-2xl border border-border">
      <h3 className="text-sm font-semibold text-primary mb-4">스트릭 현황</h3>
      {topByLongest.length === 0 ? (
        <p className="text-xs text-muted text-center py-4">아직 데이터가 없어요</p>
      ) : (
        <div className="space-y-3">
          {topByLongest.map(({ habit, current, longest }) => (
            <div key={habit.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-primary truncate mr-2">{habit.title}</span>
                <span className="text-xs text-muted flex-shrink-0">
                  🔥 {current}일 / 최고 {longest}일
                </span>
              </div>
              <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(longest / maxLongest) * 100}%`,
                    backgroundColor: categories.find(c => c.id === habit.categoryId)?.color ?? DEFAULT_COLOR,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
