import { useState } from 'react'
import { Modal } from '../common/Modal'
import { RecurrencePicker } from '../todo/RecurrencePicker'
import { CategoryPicker } from '../common/CategoryPicker'
import type { Habit, Recurrence, Category } from '../../types'

interface HabitFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description?: string
    color: string
    categoryId?: string
    recurrence: Recurrence
    reminderTime?: string
  }) => void
  categories: Category[]
  initialValues?: Partial<Habit>
}

const PRESET_COLORS = [
  '#7c3aed', '#2563eb', '#16a34a', '#d97706',
  '#dc2626', '#db2777', '#0891b2', '#65a30d',
]

const defaultRecurrence: Recurrence = { type: 'daily', interval: 1 }

export function HabitForm({ open, onClose, onSubmit, categories, initialValues }: HabitFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [color, setColor] = useState(initialValues?.color ?? PRESET_COLORS[0])
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId)
  const [recurrence, setRecurrence] = useState<Recurrence>(
    initialValues?.recurrence ?? defaultRecurrence
  )
  const [reminderTime, setReminderTime] = useState(initialValues?.reminderTime ?? '')

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      color,
      categoryId,
      recurrence,
      reminderTime: reminderTime || undefined,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initialValues ? '습관 수정' : '새 습관'}>
      <div className="p-4 space-y-4">
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="습관 이름"
          className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-primary placeholder:text-muted outline-none focus:border-accent transition-colors"
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="설명 (선택)"
          rows={2}
          className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-primary placeholder:text-muted outline-none focus:border-accent transition-colors resize-none"
        />

        {/* Color picker */}
        <div>
          <label className="text-xs font-medium text-muted mb-2 block">색상</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  color === c ? 'ring-2 ring-offset-2 ring-offset-card scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-medium text-muted mb-1.5 block">카테고리</label>
          <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
        </div>

        {/* Recurrence */}
        <div>
          <label className="text-xs font-medium text-muted mb-1.5 block">반복</label>
          <RecurrencePicker value={recurrence} onChange={setRecurrence} />
        </div>

        {/* Reminder */}
        <div>
          <label className="text-xs font-medium text-muted mb-1.5 block">알림 시간</label>
          <input
            type="time"
            value={reminderTime}
            onChange={e => setReminderTime(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-sm text-primary outline-none focus:border-accent transition-colors"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-full py-3 bg-accent text-white rounded-xl text-sm font-semibold disabled:opacity-40"
        >
          {initialValues ? '수정 완료' : '추가'}
        </button>
      </div>
    </Modal>
  )
}
