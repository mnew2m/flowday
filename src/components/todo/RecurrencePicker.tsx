import type { Recurrence } from '../../types'

interface RecurrencePickerProps {
  value: Recurrence
  onChange: (r: Recurrence) => void
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
  const update = (partial: Partial<Recurrence>) => onChange({ ...value, ...partial })

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
          <span className="text-xs text-muted">종료일</span>
          <input
            type="date"
            value={value.endDate ? value.endDate.substring(0, 10) : ''}
            onChange={e => update({ endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            className="flex-1 px-2 py-1.5 bg-input border border-border rounded-lg text-sm text-primary"
          />
          {value.endDate && (
            <button
              onClick={() => update({ endDate: undefined })}
              className="text-xs text-muted hover:text-red-400"
            >
              지우기
            </button>
          )}
        </div>
      )}
    </div>
  )
}
