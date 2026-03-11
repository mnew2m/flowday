interface DayStatus {
  date: string
  completed: boolean
  required: boolean
}

interface WeeklyViewProps {
  days: DayStatus[]
  color: string
}

export function WeeklyView({ days, color }: WeeklyViewProps) {
  return (
    <div className="flex gap-1">
      {days.map(day => (
        <div
          key={day.date}
          className={`w-6 h-6 rounded-full transition-all ${
            !day.required
              ? 'bg-muted/10'
              : day.completed
              ? 'scale-110'
              : 'bg-muted/20'
          }`}
          style={day.completed && day.required ? { backgroundColor: color } : {}}
          title={day.date}
        />
      ))}
    </div>
  )
}
