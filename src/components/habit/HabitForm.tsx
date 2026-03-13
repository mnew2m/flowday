import { useState } from 'react'
import { Modal } from '../common/Modal'
import { DatePickerSheet } from '../common/DatePickerSheet'
import { RecurrencePicker } from '../todo/RecurrencePicker'
import { CategoryPicker } from '../common/CategoryPicker'
import type { Habit, Recurrence, Category } from '../../types'

interface HabitFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description?: string
    categoryId?: string
    recurrence: Recurrence
    reminderTime?: string
  }) => void
  categories: Category[]
  initialValues?: Partial<Habit>
}

const defaultRecurrence: Recurrence = { type: 'daily', interval: 1 }

const inputCls = 'w-full px-4 py-3 text-[16px] text-primary placeholder:text-muted outline-none'

export function HabitForm({ open, onClose, onSubmit, categories, initialValues }: HabitFormProps) {
  const [title,       setTitle]       = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [categoryId,  setCategoryId]  = useState(initialValues?.categoryId)
  const [recurrence,  setRecurrence]  = useState<Recurrence>(initialValues?.recurrence ?? defaultRecurrence)
  const [reminderTime, setReminderTime] = useState(initialValues?.reminderTime ?? '')
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showRecurrence, setShowRecurrence] = useState(false)

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId,
      recurrence,
      reminderTime: reminderTime || undefined,
    })
    onClose()
  }

  const sectionStyle = { background: 'var(--color-card)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }
  const rowStyle = { borderBottom: '0.5px solid var(--color-separator)' }

  return (
    <>
    <Modal open={open} onClose={onClose} title={initialValues ? '습관 수정' : '새 습관'}>
      <div className="px-4 pt-3 pb-6 space-y-4">

        {/* Title + Description */}
        <div style={sectionStyle}>
          <div style={rowStyle}>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="습관 이름"
              className={inputCls}
              style={{ background: 'transparent' }}
            />
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="메모"
            rows={2}
            className={`${inputCls} resize-none`}
            style={{ background: 'transparent' }}
          />
        </div>

        {/* Reminder */}
        <div style={sectionStyle}>
          <div className="flex items-center px-4 py-3">
            <span className="text-[16px] text-primary flex-1">알림</span>
            <button
              type="button"
              onClick={() => setShowTimePicker(true)}
              className="text-[15px] transition-opacity active:opacity-50"
              style={{ color: reminderTime ? 'var(--color-accent)' : 'var(--color-muted)' }}
            >
              {reminderTime ? `매일 ${reminderTime}` : '설정 안 함'}
            </button>
          </div>
        </div>

        {/* Category */}
        {categories.length > 0 && (
          <div style={sectionStyle}>
            <div className="px-4 py-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-secondary mb-2">카테고리</p>
              <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
            </div>
          </div>
        )}

        {/* Recurrence */}
        <div style={sectionStyle}>
          <button
            onClick={() => setShowRecurrence(!showRecurrence)}
            className="w-full flex items-center justify-between px-4 py-3 transition-opacity active:opacity-50"
          >
            <span className="text-[16px] text-primary">반복</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[15px]" style={{ color: 'var(--color-accent)' }}>
                {{ daily: '매일', weekly: '매주', monthly: '매월', custom: '커스텀', none: '없음' }[recurrence.type]}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${showRecurrence ? 'rotate-180' : ''}`}
                style={{ color: 'var(--color-muted)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {showRecurrence && (
            <div className="px-4 pb-3" style={{ borderTop: '0.5px solid var(--color-separator)' }}>
              <div className="pt-3">
                <RecurrencePicker value={recurrence} onChange={setRecurrence} />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-full py-3.5 rounded-xl text-[16px] font-semibold text-white transition-opacity active:opacity-70 disabled:opacity-40"
          style={{ background: 'var(--color-accent)' }}
        >
          {initialValues ? '수정 완료' : '추가'}
        </button>
      </div>
    </Modal>

    <DatePickerSheet
      open={showTimePicker}
      onClose={() => setShowTimePicker(false)}
      value={reminderTime}
      onChange={setReminderTime}
      mode="time"
      title="알림 시간"
    />
    </>
  )
}
