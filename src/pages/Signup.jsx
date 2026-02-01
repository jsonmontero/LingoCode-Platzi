import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Background from '../components/Background'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Background />
        <div className="w-full max-w-md">
          <div className="glass-card p-8 md:p-10 text-center">
            <div className="text-6xl mb-6">📧</div>
            <h1 className="font-syne text-2xl font-bold mb-4">Check Your Email!</h1>
            <p className="text-text-muted mb-8">
              We've sent a confirmation link to <strong className="text-white">{email}</strong>. 
              Click the link to activate your account.
            </p>
            <Link to="/login" className="btn-neu btn-primary inline-block">
              Go to Login →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Background />
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-10">
          <div 
            className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl border-[3px] border-white flex items-center justify-center text-2xl"
            style={{ boxShadow: '4px 4px 0 white' }}
          >
            🚀
          </div>
          <span className="font-syne text-3xl font-extrabold gradient-text">
            LingoCode
          </span>
        </Link>

        {/* Signup Card */}
        <div className="glass-card p-8 md:p-10">
          <h1 className="font-syne text-2xl font-bold text-center mb-2">
            Start Learning Today!
          </h1>
          <p className="text-text-muted text-center mb-8">
            Create your free account
          </p>

          {error && (
            <div className="mb-5 p-4 bg-accent/20 border-2 border-accent rounded-xl text-accent text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white/5 border-2 border-border rounded-xl text-white placeholder-text-muted focus:border-primary focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/5 border-2 border-border rounded-xl text-white placeholder-text-muted focus:border-primary focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/5 border-2 border-border rounded-xl text-white placeholder-text-muted focus:border-primary focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neu btn-primary text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="mt-8 text-center text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-text-muted hover:text-white transition-colors text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup