import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

const DOMAINS = [
  'gmail.com',
  'naver.com',
  'kakao.com',
  'daum.net',
  'hanmail.net',
  'nate.com',
  'icloud.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
]

interface EmailInputProps {
  value: string
  onChange: (email: string) => void
}

export function EmailInput({ value, onChange }: EmailInputProps) {
  const [localPart, setLocalPart] = useState(() => value.split('@')[0] ?? '')
  const [domain, setDomain] = useState(() => value.split('@')[1] ?? '')
  const [open, setOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (localPart && domain) onChange(`${localPart}@${domain}`)
    else onChange('')
  }, [localPart, domain, onChange])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const dropdownWidth = Math.max(rect.width, 200)
    const dropdownHeight = 300 // 드롭다운 최대 높이 근사값
    const vw = window.innerWidth
    const vh = window.innerHeight

    // 오른쪽 넘침 방지
    const left = Math.min(rect.left, vw - dropdownWidth - 10)
    // 아래 넘침 시 위로 표시
    const fitsBelow = rect.bottom + dropdownHeight < vh - 10
    const top = fitsBelow ? rect.bottom + 6 : rect.top - dropdownHeight - 6

    setDropdownStyle({
      position: 'fixed',
      top: Math.max(10, top),
      left: Math.max(10, left),
      width: dropdownWidth,
      zIndex: 9999,
    })
    setOpen(o => !o)
  }

  const selectDomain = (d: string) => {
    setDomain(d)
    setOpen(false)
  }

  return (
    <div className="flex items-center" style={{ background: 'transparent' }}>
      {/* 아이디 입력 */}
      <input
        type="text"
        value={localPart}
        onChange={e => setLocalPart(e.target.value.replace(/[@\s]/g, ''))}
        placeholder="아이디"
        required
        className="flex-1 min-w-0 px-4 py-3 text-[16px] text-primary placeholder:text-muted outline-none"
        style={{ background: 'transparent' }}
      />

      {/* @ */}
      <span className="text-[16px] font-medium text-muted select-none">@</span>

      {/* 도메인 선택 버튼 */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1 px-3 py-3 text-[16px] min-w-[130px] transition-opacity active:opacity-60"
      >
        <span className={`flex-1 text-left ${domain ? 'text-primary' : 'text-muted'}`}>
          {domain || '도메인 선택'}
        </span>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--color-muted)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 드롭다운 — Portal로 overflow 탈출 */}
      {open && createPortal(
        <div
          ref={dropdownRef}
          className="rounded-xl overflow-hidden animate-alert-pop"
          style={{
            ...dropdownStyle,
            background: 'var(--color-card)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            border: '0.5px solid var(--color-separator)',
          }}
        >
          {/* 직접 입력 */}
          <div className="px-3 py-2" style={{ borderBottom: '0.5px solid var(--color-separator)' }}>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="직접 입력"
              className="w-full px-3 py-2 rounded-lg text-[14px] text-primary placeholder:text-muted outline-none"
              style={{ background: 'var(--color-fill)' }}
            />
          </div>
          {/* 목록 */}
          <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
            {DOMAINS.map((d, i) => (
              <button
                key={d}
                type="button"
                onClick={() => selectDomain(d)}
                className="w-full text-left px-4 py-2.5 text-[15px] transition-opacity active:opacity-50"
                style={{
                  color: domain === d ? 'var(--color-accent)' : 'var(--color-primary)',
                  fontWeight: domain === d ? 600 : 400,
                  borderBottom: i < DOMAINS.length - 1 ? '0.5px solid var(--color-separator)' : 'none',
                  background: 'transparent',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
