interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open, title, message,
  confirmLabel = '확인', cancelLabel = '취소',
  danger = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-fade-in">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      />
      <div
        className="relative w-full max-w-[320px] rounded-[14px] overflow-hidden animate-alert-pop"
        style={{ background: 'var(--color-card)', boxShadow: '0 8px 48px rgba(0,0,0,0.32)' }}
      >
        {/* Title + message */}
        <div className="px-6 pt-5 pb-4 text-center"
          style={{ borderBottom: '0.5px solid var(--color-separator)' }}
        >
          <p className="text-[17px] font-semibold text-primary leading-snug">{title}</p>
          <p className="text-[13px] text-secondary mt-1 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex" style={{ borderTop: '0.5px solid var(--color-separator)' }}>
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-[17px] font-normal text-accent transition-opacity active:opacity-50"
            style={{ borderRight: '0.5px solid var(--color-separator)' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 text-[17px] font-semibold transition-opacity active:opacity-50 ${
              danger ? 'text-red-500' : 'text-accent'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
