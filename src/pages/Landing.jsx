import Background from '../components/Background'
import Navbar from '../components/Navbar'
import { Code, Bot, BarChart3, Trophy, Mail, Zap } from 'lucide-react'

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Background />
      <Navbar />
      
      {/* Hero Section */}
      <section className="px-6 md:px-10 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Content */}
          <div className="fade-in">
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Learn to Code.
              <br />
              Learn <span className="gradient-text-alt">English</span>.
              <br />
              One Journey.
            </h1>
            <p className="text-lg text-text-muted mb-10 leading-relaxed max-w-xl">
              Master programming fundamentals while improving your English skills. 
              Our AI tutor corrects your code AND your grammar in real-time.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="btn-neu btn-primary text-base">
                Start Learning Free →
              </button>
              <button className="btn-neu btn-secondary text-base">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              <Stat number="8" label="Modules" />
              <Stat number="5" label="Languages" />
              <Stat number="∞" label="Practice" />
            </div>
          </div>

          {/* Right: Code Editor Preview */}
          <div className="fade-in" style={{ animationDelay: '0.2s' }}>
            <CodeEditorPreview />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-10 py-20 max-w-7xl mx-auto">
        <h2 className="font-syne text-3xl md:text-4xl font-extrabold text-center mb-16">
          Why <span className="gradient-text">LingoCode</span>?
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Zap className="w-7 h-7" />}
            title="Adaptive Learning"
            description="Take a quick test and the app adapts to your English and coding level automatically."
            gradient="from-primary to-purple-400"
          />
          <FeatureCard 
            icon={<Bot className="w-7 h-7" />}
            title="AI Tutor"
            description="Get real-time corrections for your code AND your English grammar in one response."
            gradient="from-secondary to-emerald-400"
          />
          <FeatureCard 
            icon={<Code className="w-7 h-7" />}
            title="Live Code Editor"
            description="Write HTML, CSS, JavaScript, Python and JSON with instant output preview."
            gradient="from-accent to-orange-400"
          />
          <FeatureCard 
            icon={<BarChart3 className="w-7 h-7" />}
            title="Track Progress"
            description="See your improvement in both coding skills and English grammar over time."
            gradient="from-yellow to-amber-300"
          />
          <FeatureCard 
            icon={<Trophy className="w-7 h-7" />}
            title="Achievements"
            description="Earn badges, maintain streaks, and celebrate your learning milestones."
            gradient="from-pink-500 to-rose-400"
          />
          <FeatureCard 
            icon={<Mail className="w-7 h-7" />}
            title="Daily Challenges"
            description="Receive daily coding challenges via email to keep you motivated."
            gradient="from-cyan-500 to-sky-400"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-10 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden glow-primary">
            <h2 className="font-syne text-3xl md:text-4xl font-extrabold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-text-muted text-lg mb-8">
              Join thousands of learners mastering code and English together.
            </p>
            <button className="btn-neu btn-primary text-lg px-10">
              Begin Learning Now →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t-2 border-border text-text-muted">
        Made with 💜 for the Platzi AI-Native Challenge 2026
      </footer>
    </div>
  )
}

/* Sub-components */

const Stat = ({ number, label }) => (
  <div>
    <div className="font-syne text-4xl font-extrabold text-secondary" style={{ textShadow: '0 0 30px rgba(6, 214, 160, 0.5)' }}>
      {number}
    </div>
    <div className="text-text-muted text-sm">{label}</div>
  </div>
)

const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:glow-primary group">
    <div 
      className={`w-14 h-14 rounded-2xl border-[3px] border-white flex items-center justify-center mb-5 bg-gradient-to-br ${gradient}`}
      style={{ boxShadow: '4px 4px 0 #8B5CF6' }}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-text-muted leading-relaxed">{description}</p>
  </div>
)

const CodeEditorPreview = () => (
  <div className="glass-card overflow-hidden">
    {/* Editor Header */}
    <div className="flex justify-between items-center px-5 py-4 bg-black/30 border-b-2 border-border">
      <div className="flex gap-2">
        <div className="w-3.5 h-3.5 rounded-full bg-accent border-2 border-white/30" />
        <div className="w-3.5 h-3.5 rounded-full bg-yellow border-2 border-white/30" />
        <div className="w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white/30" />
      </div>
      <div className="flex gap-1">
        <Tab active>main.py</Tab>
        <Tab>index.html</Tab>
      </div>
    </div>

    {/* Editor Content */}
    <div className="grid md:grid-cols-2">
      {/* Code Panel */}
      <div className="p-5 font-mono text-sm leading-loose border-r-2 border-border">
        <CodeLine num={1} comment="# My first Python loop" />
        <CodeLine num={2}><span className="text-primary">for</span> <span className="text-accent">i</span> <span className="text-primary">in</span> <span className="text-yellow">range</span>(5):</CodeLine>
        <CodeLine num={3}>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow">print</span>(<span className="text-secondary">"Hello!"</span>)</CodeLine>
      </div>

      {/* Output Panel */}
      <div className="p-5 bg-black/20">
        <div className="text-xs text-text-muted uppercase tracking-wider mb-3">▶ Output</div>
        <div className="bg-secondary/10 border-2 border-secondary rounded-xl p-4 font-mono text-secondary text-sm">
          Hello!<br/>Hello!<br/>Hello!<br/>Hello!<br/>Hello!
        </div>
      </div>
    </div>

    {/* AI Chat */}
    <div className="m-5 p-5 bg-primary/10 border-2 border-primary rounded-2xl glow-primary">
      <div className="flex gap-4">
        <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl border-[3px] border-white flex items-center justify-center text-lg flex-shrink-0">
          🤖
        </div>
        <div className="flex-1">
          <div className="bg-white/5 p-3 rounded-xl mb-3 border-l-4 border-yellow">
            <div className="text-xs text-yellow mb-1">📝 English Correction</div>
            <div className="text-sm">"How do I <strong>create</strong> a loop?" (not "how I do a loop")</div>
          </div>
          <p className="text-sm text-text-muted">
            Great question! A <strong className="text-white">for loop</strong> repeats code a specific number of times.
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
            💡 Tip: Questions start with "How do I..." not "How I do..."
          </div>
        </div>
      </div>
    </div>
  </div>
)

const Tab = ({ children, active }) => (
  <div className={`px-4 py-2 rounded-lg font-mono text-xs cursor-pointer transition-all ${
    active 
      ? 'bg-primary border-2 border-white text-white' 
      : 'bg-white/5 text-text-muted hover:bg-white/10'
  }`} style={active ? { boxShadow: '2px 2px 0 white' } : {}}>
    {children}
  </div>
)

const CodeLine = ({ num, children, comment }) => (
  <div className="flex">
    <span className="text-text-muted mr-5 select-none w-4">{num}</span>
    {comment ? <span className="text-text-muted">{comment}</span> : children}
  </div>
)

export default Landing