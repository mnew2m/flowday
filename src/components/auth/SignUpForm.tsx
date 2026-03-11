import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { EmailInput } from './EmailInput'

interface SignUpFormProps {
  onSwitch: () => void
}

const inputCls = 'w-full px-4 py-3 text-[16px] text-primary placeholder:text-muted outline-none rounded-xl'

export function SignUpForm({ onSwitch }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // const [success, setSuccess] = useState(false) // 이메일 인증 비활성화 중

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else onSwitch() // 이메일 인증 비활성화 중 → 가입 후 바로 로그인 탭으로 이동
    // else setSuccess(true)
    setLoading(false)
  }

  // 이메일 인증 비활성화 중
  // if (success) {
  //   return (
  //     <div className="text-center py-4 space-y-3">
  //       <div className="text-[48px]">📧</div>
  //       <p className="text-[17px] font-semibold text-primary">확인 이메일을 보냈어요!</p>
  //       <p className="text-[14px] text-secondary leading-relaxed">
  //         이메일에서 인증 링크를 클릭한 후<br/>로그인하세요.
  //       </p>
  //       <button
  //         onClick={onSwitch}
  //         className="text-[15px] font-semibold transition-opacity active:opacity-50"
  //         style={{ color: 'var(--color-accent)' }}
  //       >
  //         로그인으로 이동
  //       </button>
  //     </div>
  //   )
  // }

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
          placeholder="비밀번호 (6자 이상)"
          minLength={6}
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
        {loading ? '가입 중...' : '회원가입'}
      </button>

      <p className="text-center text-[14px] text-secondary">
        이미 계정이 있으신가요?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold transition-opacity active:opacity-50" style={{ color: 'var(--color-accent)' }}>
          로그인
        </button>
      </p>
    </form>
  )
}
