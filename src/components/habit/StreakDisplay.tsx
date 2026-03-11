interface StreakDisplayProps {
  current: number
  longest: number
}

export function StreakDisplay({ current, longest }: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <span className="text-lg">🔥</span>
        <div>
          <p className="text-xs text-muted leading-none">현재</p>
          <p className="text-sm font-bold text-primary">{current}일</p>
        </div>
      </div>
      <div className="w-px h-8 bg-border" />
      <div className="flex items-center gap-1">
        <span className="text-lg">🏆</span>
        <div>
          <p className="text-xs text-muted leading-none">최고</p>
          <p className="text-sm font-bold text-primary">{longest}일</p>
        </div>
      </div>
    </div>
  )
}
