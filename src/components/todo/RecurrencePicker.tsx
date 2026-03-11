import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { DatePickerSheet } from '../common/DatePickerSheet'
import type { Recurrence } from '../../types'

interface RecurrencePickerProps {
  value: Recurrence
  onChange: (r: Recurrence) => void
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
  const update = (partial: Partial<Recurrence>) => onChange({ ...value, ...partial })
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)

  const endDateValue = value.endDate ? value.endDate.substring(0, 10) : ''

  return (
    <div className="space-y-3">
      {/* Type buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['none', 'daily', 'weekly', 'monthly', 'custom'] as const).map(type => (
          <button
            key={type}
            onClick={() => update({ type })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              value.type === type
                ? 'bg-accent text-white border-accent'
                : 'border-border text-muted'
            }`}
          >
            {{ none: '반복없음', daily: '매일', weekly: '매주', monthly: '매월', custom: '커스텀' }[type]}
          </button>
        ))}
      </div>

      {/* Days of week (weekly / custom) */}
      {(value.type === 'weekly' || value.type === 'custom') && (
        <div>
          <p className="text-xs text-muted mb-2">요일 선택</p>
          <div className="flex gap-1.5">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => {
                  const days = value.daysOfWeek ?? []
                  update({
                    daysOfWeek: days.includes(i) ? days.filter(d => d !== i) : [...days, i],
                  })
                }}
                className={`w-9 h-9 rounded-full text-xs font-medium transition-colors ${
                  value.daysOfWeek?.includes(i)
                    ? 'bg-accent text-white'
                    : 'bg-muted/10 text-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interval (custom) */}
      {value.type === 'custom' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">매</span>
          <input
            type="number"
            min={1}
            max={365}
            value={value.interval}
            onChange={e => update({ interval: parseInt(e.target.value) || 1 })}
            className="w-16 px-2 py-1.5 bg-input border border-border rounded-lg text-sm text-primary text-center"
          />
          <span className="text-xs text-muted">일마다</span>
        </div>
      )}

      {/* End date */}
      {value.type !== 'none' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted flex-shrink-0">종료일</span>
          <button
            type="button"
            onClick={() => setShowEndDatePicker(true)}
            className="flex-1 px-3 py-1.5 rounded-lg text-sm text-left transition-opacity active:opacity-50"
            style={{
              background: 'var(--color-fill)',
              color: value.endDate ? 'var(--color-accent)' : 'var(--color-muted)',
            }}
          >
            {value.endDate
              ? format(parseISO(endDateValue), 'yyyy년 M월 d일 (E)', { locale: ko })
              : '날짜 없음'}
          </button>
          {value.endDate && (
            <button
              onClick={() => update({ endDate: undefined })}
              className="text-xs flex-shrink-0 transition-opacity active:opacity-50"
              style={{ color: 'var(--color-muted)' }}
            >
              지우기
            </button>
          )}
        </div>
      )}

      <DatePickerSheet
        open={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        value={endDateValue}
        onChange={v => update({ endDate: v ? new Date(v).toISOString() : undefined })}
        mode="date"
        title="종료일"
      />
    </div>
  )
}
