interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  compact?: boolean
}

export function EmptyState({ icon, title, description, action, compact }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 text-center ${compact ? 'py-8' : 'py-20'}`}>
      <div className={`leading-none ${compact ? 'text-[36px] mb-2' : 'text-[56px] mb-4'}`}>{icon}</div>
      <p className={`font-semibold text-primary tracking-[-0.2px] ${compact ? 'text-[15px]' : 'text-[17px]'}`}>{title}</p>
      <p className={`text-secondary mt-1 leading-relaxed ${compact ? 'text-[12px]' : 'text-[14px] mt-1.5'}`}>{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-2.5 rounded-xl text-[15px] font-semibold text-white transition-opacity active:opacity-70"
          style={{ background: 'var(--color-accent)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
