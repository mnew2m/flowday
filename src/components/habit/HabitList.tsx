import { HabitCard } from './HabitCard'
import { EmptyState } from '../common/EmptyState'
import type { Habit, HabitCompletion, Category } from '../../types'

interface HabitListProps {
  habits: Habit[]
  completions: HabitCompletion[]
  categories: Category[]
  isCompletedToday: (id: string) => boolean
  getCompletionsForHabit: (id: string) => HabitCompletion[]
  onToggle: (id: string) => void
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
  onAdd: () => void
}

export function HabitList({
  habits,
  categories,
  isCompletedToday,
  getCompletionsForHabit,
  onToggle,
  onEdit,
  onDelete,
  onArchive,
  onAdd,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <EmptyState
        icon="🌱"
        title="습관이 없어요"
        description="좋은 습관을 만들어보세요"
        action={{ label: '습관 추가', onClick: onAdd }}
      />
    )
  }

  return (
    <div className="space-y-3">
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          completions={getCompletionsForHabit(habit.id)}
          categories={categories}
          isCompletedToday={isCompletedToday(habit.id)}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      ))}
    </div>
  )
}
