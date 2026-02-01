import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Background from '../components/Background'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
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

        {/* Login Card */}
        <div className="glass-card p-8 md:p-10">
          <h1 className="font-syne text-2xl font-bold text-center mb-2">
            Welcome Back!
          </h1>
          <p className="text-text-muted text-center mb-8">
            Continue your learning journey
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neu btn-primary text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In →'}
            </button>
          </form>

          <div className="mt-8 text-center text-text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-secondary hover:underline font-medium">
              Sign up free
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

export default Login