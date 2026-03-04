import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  ScanFace,
  Shield,
  ShieldAlert,
} from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email({ message: 'Invalid email format' }),
  password: z.string().min(1, 'Password is required').min(6, 'Minimum 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>
type BiometricState = 'idle' | 'scanning' | 'success' | 'error' | 'unavailable'

const DEMO_ACCOUNTS =
  import.meta.env.DEV
    ? [
        { role: 'Admin', email: 'admin@mssp.com', password: 'admin123' },
        { role: 'Client', email: 'client@demo.com', password: 'client123' },
      ]
    : []

function SocialButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-sm font-medium text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15"
    >
      <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>
      {label}
    </button>
  )
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [showPwd, setShowPwd] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [serverError, setServerError] = useState<string | null>(null)
  const [bioState, setBioState] = useState<BiometricState>('idle')
  const [bioMsg, setBioMsg] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        top: `${(i * 31) % 100}%`,
        left: `${(i * 17) % 100}%`,
        delay: `${(i * 0.2).toFixed(2)}s`,
        duration: `${4 + (i % 5)}s`,
      })),
    []
  )

  async function handleBiometric() {
    setBioMsg(null)

    if (!window.PublicKeyCredential) {
      setBioState('unavailable')
      setBioMsg('Your browser does not support WebAuthn / biometric authentication.')
      return
    }

    const hasPlatform = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(
      () => false
    )

    if (!hasPlatform) {
      setBioState('unavailable')
      setBioMsg('No Face ID or Windows Hello authenticator detected on this device.')
      return
    }

    try {
      setBioState('scanning')

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname,
          allowCredentials: [],
        },
      })

      if (credential) {
        setBioState('success')
        await new Promise((resolve) => setTimeout(resolve, 650))

        try {
          const user = await login({ email: 'client@demo.com', password: 'client123' })
          navigate(user.role === 'admin_mssp' ? '/admin/dashboard' : '/dashboard', { replace: true })
        } catch {
          setBioState('error')
          setBioMsg('Session error after biometric. Please use email/password.')
        }
      }
    } catch (err: unknown) {
      setBioState('error')
      const name = err instanceof Error ? err.name : ''

      if (name === 'NotAllowedError') setBioMsg('Cancelled or permission denied.')
      else if (name === 'SecurityError') setBioMsg('Biometric auth requires HTTPS.')
      else if (name === 'InvalidStateError')
        setBioMsg('No registered credentials found. Sign in with email first.')
      else setBioMsg('Authentication failed. Please use email and password.')

      setTimeout(() => {
        setBioState('idle')
        setBioMsg(null)
      }, 4000)
    }
  }

  const onSubmit = async (data: LoginForm) => {
    setServerError(null)

    try {
      const user = await login(data)
      navigate(user.role === 'admin_mssp' ? '/admin/dashboard' : '/dashboard', { replace: true })
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status
      setServerError(
        status === 401
          ? 'Incorrect email or password.'
          : status === 429
            ? 'Too many attempts. Please wait a few minutes.'
            : 'Connection error. Please check your network.'
      )
    }
  }

  const bioConfig = {
    idle: { icon: ScanFace, color: 'text-cyan-200', label: 'Sign in with Face ID' },
    scanning: { icon: ScanFace, color: 'text-cyan-200', label: 'Scanning...' },
    success: { icon: CheckCircle2, color: 'text-emerald-300', label: 'Verified' },
    error: { icon: ShieldAlert, color: 'text-rose-300', label: 'Failed' },
    unavailable: { icon: ScanFace, color: 'text-white/50', label: 'Biometrics N/A' },
  }[bioState]

  const BioIcon = bioConfig.icon

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080a14] text-white">
      <style>{`
        @keyframes mesh-shift {
          0% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-2%,2%,0) scale(1.08); }
          100% { transform: translate3d(2%,-1%,0) scale(1.04); }
        }
        @keyframes blob-float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(14px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: .18; transform: scale(1); }
          50% { opacity: .5; transform: scale(1.5); }
        }
        @keyframes card-enter {
          from { opacity: 0; transform: translateY(22px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        className="absolute inset-[-10%] opacity-90"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(55, 215, 255, 0.30), transparent 35%), radial-gradient(circle at 80% 25%, rgba(255, 99, 191, 0.26), transparent 40%), radial-gradient(circle at 70% 80%, rgba(80, 126, 255, 0.26), transparent 36%), linear-gradient(125deg, #090f1f 0%, #121a31 45%, #201129 100%)',
          animation: 'mesh-shift 16s ease-in-out infinite alternate',
          filter: 'saturate(1.2)',
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[16%] h-60 w-60 rounded-full bg-cyan-300/12 blur-3xl" style={{ animation: 'blob-float 10s ease-in-out infinite' }} />
        <div className="absolute right-[6%] top-[8%] h-72 w-72 rounded-full bg-fuchsia-300/12 blur-3xl" style={{ animation: 'blob-float 12s ease-in-out infinite' }} />
        <div className="absolute bottom-[5%] left-[30%] h-64 w-64 rounded-full bg-blue-300/14 blur-3xl" style={{ animation: 'blob-float 11s ease-in-out infinite' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: s.top,
              left: s.left,
              animation: `twinkle ${s.duration} ease-in-out infinite`,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div
          className="w-full max-w-[480px] rounded-[28px] border border-white/25 bg-white/10 p-6 shadow-[0_35px_85px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8"
          style={{ animation: 'card-enter 550ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-cyan-100 ring-1 ring-white/35">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-white/80">Sign in to your secure workspace</p>
          </div>

          {serverError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200/30 bg-rose-400/10 p-3 text-sm text-rose-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Email</label>
              <div className="group relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60 transition-colors group-focus-within:text-cyan-100" />
                <input
                  {...register('email')}
                  autoComplete="email"
                  placeholder="name@company.com"
                  className={cn(
                    'h-11 w-full rounded-xl border border-white/25 bg-black/20 pl-10 pr-3 text-sm text-white placeholder:text-white/45 outline-none transition-all duration-300',
                    'focus:-translate-y-0.5 focus:border-white/55 focus:ring-4 focus:ring-cyan-200/15',
                    errors.email && 'border-rose-200/65 focus:border-rose-200/75 focus:ring-rose-300/20'
                  )}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-100">{errors.email.message}</p>}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Password</label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs font-medium text-cyan-100 transition-colors hover:text-white"
                >
                  Forgot password?
                </a>
              </div>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60 transition-colors group-focus-within:text-cyan-100" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  {...register('password')}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={cn(
                    'h-11 w-full rounded-xl border border-white/25 bg-black/20 pl-10 pr-10 text-sm text-white placeholder:text-white/45 outline-none transition-all duration-300',
                    'focus:-translate-y-0.5 focus:border-white/55 focus:ring-4 focus:ring-cyan-200/15',
                    errors.password && 'border-rose-200/65 focus:border-rose-200/75 focus:ring-rose-300/20'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/65 transition-colors hover:text-white"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-100">{errors.password.message}</p>}
            </div>

            <label htmlFor="remember" className="flex cursor-pointer items-center gap-2 text-sm text-white/85">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/35 bg-black/20 text-cyan-200 focus:ring-2 focus:ring-cyan-100/30 focus:ring-offset-0"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(90,220,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? (
                <Spinner size="sm" className="border-t-slate-900 text-slate-900" />
              ) : (
                <>
                  Login
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.14em] text-white/60">
              <span className="bg-transparent px-3">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SocialButton
              icon={
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.5-1.87 4.4-5.27 4.4-3.17 0-5.75-2.62-5.75-5.85s2.58-5.85 5.75-5.85c1.8 0 3 .77 3.69 1.44l2.5-2.42C16.78 4.21 14.7 3.2 12.17 3.2 7.24 3.2 3.22 7.28 3.22 12.57s4.02 9.37 8.95 9.37c5.17 0 8.58-3.67 8.58-8.84 0-.6-.06-1.04-.15-1.5z" />
                </svg>
              }
              label="Google"
            />
            <SocialButton icon={<Github className="h-4 w-4" />} label="GitHub" />
          </div>

          <div className="mt-5 border-t border-white/20 pt-4 text-center">
            <button
              type="button"
              onClick={handleBiometric}
              disabled={bioState === 'scanning' || bioState === 'unavailable'}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                bioState === 'unavailable' ? 'cursor-not-allowed text-white/45' : 'text-cyan-100 hover:bg-white/10'
              )}
            >
              <BioIcon className={cn('h-4 w-4', bioConfig.color, bioState === 'scanning' && 'animate-pulse')} />
              {bioConfig.label}
            </button>
            {bioMsg && <p className="mt-1.5 text-xs text-rose-100">{bioMsg}</p>}
          </div>

          {import.meta.env.DEV && DEMO_ACCOUNTS.length > 0 && (
            <div className="mt-5 border-t border-white/20 pt-4">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                Dev Quick Login
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      setValue('email', acc.email)
                      setValue('password', acc.password)
                      setServerError(null)
                    }}
                    className="rounded-lg border border-white/25 bg-white/5 px-3 py-1.5 text-[11px] text-white/80 transition-colors hover:border-cyan-100/60 hover:bg-white/10"
                  >
                    {acc.role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
