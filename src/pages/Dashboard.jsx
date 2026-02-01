import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Background from '../components/Background'
import { LogOut, Play, BookOpen, Trophy, Flame, Code, ChevronRight } from 'lucide-react'

const MODULES = [
  { id: 1, title: 'Programming Foundations', lessons: 3 },
  { id: 2, title: 'Control Flow', lessons: 1 },
  { id: 3, title: 'Functions', lessons: 1 },
]

const Dashboard = () => {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background />
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen">
      <Background />
      
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 backdrop-blur-xl bg-white/[0.03] border-b-2 border-border sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div 
            className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl border-[3px] border-white flex items-center justify-center text-lg"
            style={{ boxShadow: '3px 3px 0 white' }}
          >
            🚀
          </div>
          <span className="font-syne text-xl font-extrabold gradient-text">
            LingoCode
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm text-text-muted">{user.email}</div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border-2 border-border rounded-xl hover:bg-white/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="font-syne text-3xl md:text-4xl font-bold mb-2">Welcome! 👋</h1>
          <p className="text-text-muted">Ready to learn coding and English?</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={<Flame className="w-6 h-6" />} value="1" label="Day Streak" color="from-accent to-orange-400" />
          <StatCard icon={<BookOpen className="w-6 h-6" />} value="0%" label="Complete" color="from-primary to-purple-400" />
          <StatCard icon={<Code className="w-6 h-6" />} value="0" label="Lessons" color="from-secondary to-emerald-400" />
          <StatCard icon={<Trophy className="w-6 h-6" />} value="0" label="Achievements" color="from-yellow to-amber-400" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-syne text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/playground" className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/20 to-purple-500/20 border-2 border-primary rounded-xl hover:scale-[1.02] transition-transform">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Code Playground</div>
                    <div className="text-sm text-text-muted">Practice coding</div>
                  </div>
                </Link>
                <Link to="/assessment" className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary/20 to-emerald-500/20 border-2 border-secondary rounded-xl hover:scale-[1.02] transition-transform">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Take Assessment</div>
                    <div className="text-sm text-text-muted">Find your level</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-syne text-xl font-bold mb-4">Learning Path</h2>
              <div className="space-y-3">
                {MODULES.map((module, index) => (
                  <Link
                    key={module.id}
                    to={`/lesson/${module.id}/1`}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 bg-white/5 border-border hover:border-primary cursor-pointer transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-gradient-to-br from-primary to-secondary">
                      {module.id}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{module.title}</div>
                      <div className="text-xs text-text-muted mt-1">{module.lessons} lessons</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 border-2 border-primary glow-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-xl">🤖</div>
                <h2 className="font-syne text-lg font-bold">AI Tutor</h2>
              </div>
              <p className="text-sm text-text-muted mb-4">Your personal assistant for coding AND English!</p>
              <Link to="/playground" className="block text-center btn-neu btn-primary text-sm">
                Start Chatting →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const StatCard = ({ icon, value, label, color }) => (
  <div className="glass-card p-5">
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>{icon}</div>
    <div className="font-syne text-2xl font-bold">{value}</div>
    <div className="text-sm text-text-muted">{label}</div>
  </div>
)

export default Dashboard