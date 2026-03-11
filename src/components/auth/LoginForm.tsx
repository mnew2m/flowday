import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { EmailInput } from './EmailInput'

interface LoginFormProps {
  onSwitch: () => void
}

const inputCls = 'w-full px-4 py-3 text-[16px] text-primary placeholder:text-muted outline-none rounded-xl'

export function LoginForm({ onSwitch }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const sectionStyle = { background: 'var(--color-fill)', borderRadius: '12px', overflow: 'hidden' }
  const rowStyle = { borderBottom: '0.5px solid var(--color-separator)' }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div style={sectionStyle}>
        <div style={rowStyle}>
          <EmailInput value={email} onChange={setEmail} />
        </div>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호"
          required
          className={inputCls}
          style={{ background: 'transparent' }}
        />
      </div>

      {error && (
        <p className="text-[13px] text-red-500 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full py-3.5 rounded-xl text-[16px] font-semibold text-white transition-opacity active:opacity-70 disabled:opacity-40"
        style={{ background: 'var(--color-accent)' }}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>

      <p className="text-center text-[14px] text-secondary">
        계정이 없으신가요?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold transition-opacity active:opacity-50" style={{ color: 'var(--color-accent)' }}>
          회원가입
        </button>
      </p>
    </form>
  )
}
