import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { useCategories } from '../hooks/useCategories'
import { HabitList } from '../components/habit/HabitList'
import { HabitForm } from '../components/habit/HabitForm'
import type { Habit } from '../types'

type Tab = 'active' | 'archived'

export function HabitsPage() {
  const {
    habits, completions, loading,
    addHabit, updateHabit, deleteHabit, toggleCompletion,
    getCompletionsForHabit, isCompletedToday,
  } = useHabits()
  const { categories } = useCategories()
  const [tab, setTab] = useState<Tab>('active')
  const [formOpen, setFormOpen] = useState(false)
  const [editHabit, setEditHabit] = useState<Habit | null>(null)

  const activeHabits = habits.filter(h => !h.archived)
  const archivedHabits = habits.filter(h => h.archived)
  const completedToday = activeHabits.filter(h => isCompletedToday(h.id)).length

  const handleEdit = (habit: Habit) => {
    setEditHabit(habit)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data: Parameters<typeof addHabit>[0]) => {
    if (editHabit) await updateHabit(editHabit.id, data)
    else await addHabit(data)
    setEditHabit(null)
  }

  const handleArchive = (id: string) => {
    const habit = habits.find(h => h.id === id)
    if (habit) updateHabit(id, { archived: !habit.archived })
  }

  return (
    <div className="pt-safe">
      {/* Header */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[34px] font-bold text-primary tracking-[-0.5px] leading-tight">습관</h1>
            {activeHabits.length > 0 && (
              <p className="text-[13px] text-secondary mt-0.5">
                오늘 {completedToday}/{activeHabits.length} 완료
              </p>
            )}
          </div>
          <button
            onClick={() => { setEditHabit(null); setFormOpen(true) }}
            className="mb-1 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 active:opacity-70 shadow-card"
            style={{ background: 'var(--color-accent)' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3v12M3 9h12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Today progress bar */}
        {activeHabits.length > 0 && (
          <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-fill)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedToday / activeHabits.length) * 100}%`,
                background: 'var(--color-accent)',
              }}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          {(['active', 'archived'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[14px] font-medium transition-all active:scale-95"
              style={
                tab === t
                  ? { background: 'var(--color-accent)', color: 'white' }
                  : { background: 'var(--color-fill)', color: 'var(--color-secondary)' }
              }
            >
              {t === 'active' ? `활성 ${activeHabits.length > 0 ? `(${activeHabits.length})` : ''}` : `보관 ${archivedHabits.length > 0 ? `(${archivedHabits.length})` : ''}`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-[2.5px] border-accent border-t-transparent animate-spin" />
          </div>
        ) : (
          <HabitList
            habits={tab === 'active' ? activeHabits : archivedHabits}
            completions={completions}
            categories={categories}
            isCompletedToday={isCompletedToday}
            getCompletionsForHabit={getCompletionsForHabit}
            onToggle={toggleCompletion}
            onEdit={handleEdit}
            onDelete={deleteHabit}
            onArchive={handleArchive}
            onAdd={() => { setEditHabit(null); setFormOpen(true) }}
          />
        )}
      </div>

      <HabitForm
        key={editHabit?.id ?? 'new'}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditHabit(null) }}
        onSubmit={handleFormSubmit}
        categories={categories}
        initialValues={editHabit ?? undefined}
      />
    </div>
  )
}
