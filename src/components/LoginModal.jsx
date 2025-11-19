import { useEffect, useState } from 'react'
import { apiPost } from '../lib/api'

export default function LoginModal({ open, onClose, onLoggedIn }) {
  const [step, setStep] = useState('form') // form | otp
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoOtp, setDemoOtp] = useState('')

  useEffect(() => {
    if (!open) return
    setStep('form'); setError(''); setCode(''); setDemoOtp('')
  }, [open])

  const requestOtp = async () => {
    setError('')
    if (!/^\+?\d{10,14}$/.test(phone)) { setError('Enter a valid phone number'); return }
    try {
      setLoading(true)
      const res = await apiPost('/auth/request-otp', { name, phone })
      setDemoOtp(res.demo_code)
      setStep('otp')
    } catch (e) {
      setError('Failed to send OTP')
    } finally { setLoading(false) }
  }

  const verifyOtp = async () => {
    setError('')
    try {
      setLoading(true)
      const res = await apiPost('/auth/verify-otp', { phone, code })
      localStorage.setItem('pz_token', res.token)
      localStorage.setItem('pz_user', JSON.stringify(res.user))
      onLoggedIn(res.user, res.token)
      onClose()
    } catch (e) {
      setError('Invalid or expired OTP')
    } finally { setLoading(false) }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-900">Welcome to PrintZest</h2>
        <p className="text-slate-600 mt-1">Sign in with your phone number</p>

        {step === 'form' && (
          <div className="mt-4 space-y-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full border rounded-lg px-3 py-2" />
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone (e.g., +911234567890)" className="w-full border rounded-lg px-3 py-2" />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button onClick={requestOtp} disabled={loading} className="w-full bg-slate-900 text-white py-2 rounded-lg hover:opacity-90">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            {demoOtp && <p className="text-xs text-slate-500">Demo OTP: {demoOtp}</p>}
          </div>
        )}

        {step === 'otp' && (
          <div className="mt-4 space-y-3">
            <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter OTP" className="w-full border rounded-lg px-3 py-2 tracking-widest" />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button onClick={verifyOtp} disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:opacity-90">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button onClick={()=>setStep('form')} className="w-full text-slate-700 underline text-sm">Edit phone</button>
            {demoOtp && <p className="text-xs text-slate-500">Demo OTP: {demoOtp}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
