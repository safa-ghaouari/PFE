import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, Mail, Lock, ScanFace } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/utils/cn'
import '../../../LoginPage.css'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(6, 'At least 6 characters'),
})

type Form = z.infer<typeof schema>
type BioState = 'idle' | 'scanning' | 'success' | 'error' | 'unavailable'

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const COUNT = 80
    const DIST = 140

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number }
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.3,
    }))

    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      }

      for (let i = 0; i < COUNT; i += 1) {
        for (let j = i + 1; j < COUNT; j += 1) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 180, 255, ${(1 - d / DIST) * 0.25})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(0, 200, 255, ${p.alpha})`)
        g.addColorStop(1, 'rgba(0, 200, 255, 0)')

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 220, 255, ${p.alpha})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="login-network" />
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(false)
  const [srvErr, setSrvErr] = useState<string | null>(null)
  const [bio, setBio] = useState<BioState>('idle')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => {
    setSrvErr(null)

    try {
      const user = await login(data)
      navigate(user.role === 'admin_mssp' ? '/admin/dashboard' : '/dashboard', { replace: true })
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status

      setSrvErr(
        status === 401
          ? 'Incorrect email or password.'
          : status === 429
            ? 'Too many attempts. Try again later.'
            : 'Connection error. Check your network.',
      )
    }
  }

  const handleBio = async () => {
    if (!window.PublicKeyCredential) {
      setBio('unavailable')
      return
    }

    const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(
      () => false,
    )

    if (!isAvailable) {
      setBio('unavailable')
      return
    }

    try {
      setBio('scanning')
      const challenge = crypto.getRandomValues(new Uint8Array(32))
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
        setBio('success')
        await new Promise(resolve => setTimeout(resolve, 600))
        const user = await login({ email: 'client@demo.com', password: 'client123' })
        navigate(user.role === 'admin_mssp' ? '/admin/dashboard' : '/dashboard', { replace: true })
      }
    } catch {
      setBio('error')
      setTimeout(() => setBio('idle'), 3000)
    }
  }

  return (
    <div className="login-page">
      <NetworkCanvas />
      <div className="login-grid-overlay" />
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-shell">
        <p className="login-platform">Cyber Threat Intelligence Platform</p>

        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue to your workspace.</p>
          </div>

          {srvErr && (
            <div className="login-alert">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {srvErr}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label className="login-label">Email</label>
              <div className="login-field-wrap">
                <Mail className="login-field-icon" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={cn('login-input', errors.email && 'login-input-error')}
                />
              </div>
              {errors.email && <p className="login-error">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="login-label">Password</label>
              <div className="login-field-wrap">
                <Lock className="login-field-icon" />
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={cn('login-input login-input-password', errors.password && 'login-input-error')}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="login-toggle-password">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="login-error">{errors.password.message}</p>}
            </div>

            <label className="login-remember-row">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="login-checkbox"
              />
              <span>Remember me</span>
            </label>

            <button type="submit" disabled={isSubmitting} className="login-submit">
              {isSubmitting ? <Spinner size="sm" className="mx-auto border-t-white" /> : 'Sign In'}
            </button>
          </form>

          <div className="login-forgot-wrap">
            <button type="button" onClick={e => e.preventDefault()} className="login-link-button">
              Forgot Password?
            </button>
          </div>

          <div className="login-divider">
            <div />
            <span>OR</span>
            <div />
          </div>

          <button type="button" onClick={handleBio} disabled={bio === 'scanning' || bio === 'unavailable'} className={cn('login-bio', `login-bio-${bio}`)}>
            <ScanFace className={cn('h-4 w-4', bio === 'scanning' && 'animate-pulse')} />
            <span>
              {bio === 'idle' && 'Sign in with Face ID'}
              {bio === 'scanning' && 'Scanning...'}
              {bio === 'success' && 'Verified'}
              {bio === 'error' && 'Failed - try again'}
              {bio === 'unavailable' && 'Biometrics unavailable'}
            </span>
            {bio === 'scanning' && <Spinner size="sm" />}
          </button>
        </div>

        {import.meta.env.DEV && (
          <div className="login-dev-box">
            <p className="login-dev-title">Dev Quick Login</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Admin MSSP', email: 'admin@mssp.com', pw: 'admin123' },
                { label: 'Client', email: 'client@demo.com', pw: 'client123' },
              ].map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setValue('email', acc.email)
                    setValue('password', acc.pw)
                    setSrvErr(null)
                  }}
                  className="login-dev-button"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="login-copyright">Copyright {new Date().getFullYear()} MSSP Platform - Confidential</p>
      </div>
    </div>
  )
}
