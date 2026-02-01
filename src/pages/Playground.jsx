import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { askAI } from '../lib/groq'
import Background from '../components/Background'
import { 
  Play, 
  Trash2, 
  Send, 
  ArrowLeft, 
  Copy, 
  Check,
  Bot,
  User,
  Loader2
} from 'lucide-react'

const LANGUAGES = [
  { id: 'html', name: 'HTML', color: 'from-orange-500 to-red-500' },
  { id: 'css', name: 'CSS', color: 'from-blue-500 to-indigo-500' },
  { id: 'javascript', name: 'JavaScript', color: 'from-yellow-400 to-amber-500' },
  { id: 'python', name: 'Python', color: 'from-green-500 to-emerald-500' },
]

const DEFAULT_CODE = {
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello, LingoCode!</h1>
  <p>Start coding here...</p>
</body>
</html>`,
  css: `/* Style your page */
body {
  font-family: Arial, sans-serif;
  background: #1a1a2e;
  color: white;
  padding: 20px;
}

h1 {
  color: #8B5CF6;
}`,
  javascript: `// JavaScript playground
console.log("Hello, LingoCode!");

// Try a loop
for (let i = 1; i <= 5; i++) {
  console.log("Count: " + i);
}`,
  python: `# Python playground
print("Hello, LingoCode!")

# Try a loop
for i in range(1, 6):
    print(f"Count: {i}")`
}

const Playground = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(DEFAULT_CODE.javascript)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // AI Chat
  const [chatMessages, setChatMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hi! 👋 I'm your AI tutor. Ask me anything about coding, and I'll help you learn English too! Try asking: \"how I make a loop?\" (yes, with that grammar mistake! 😉)" 
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(DEFAULT_CODE[lang])
    setOutput('')
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')

    try {
      if (language === 'javascript') {
        // Capture console.log output
        const logs = []
        const originalLog = console.log
        console.log = (...args) => logs.push(args.join(' '))
        
        try {
          // eslint-disable-next-line no-new-func
          new Function(code)()
          setOutput(logs.join('\n') || 'Code executed successfully! (no output)')
        } catch (err) {
          setOutput(`Error: ${err.message}`)
        }
        
        console.log = originalLog
      } 
      else if (language === 'python') {
        // Use Piston API for Python
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: 'python',
            version: '3.10',
            files: [{ content: code }]
          })
        })
        const data = await response.json()
        setOutput(data.run?.output || data.run?.stderr || 'No output')
      }
      else if (language === 'html' || language === 'css') {
        setOutput('HTML/CSS preview coming soon! For now, copy your code and test it in a browser.')
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`)
    }

    setIsRunning(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearCode = () => {
    setCode('')
    setOutput('')
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return

    const userMessage = chatInput.trim()
    setChatInput('')
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    // Get AI response
    setIsAiLoading(true)
    const response = await askAI(userMessage, {
      englishLevel: 'B1',
      programmingLevel: 'beginner',
      currentLesson: `${language} programming`
    })
    
    setChatMessages(prev => [...prev, { role: 'assistant', content: response.message }])
    setIsAiLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background />
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 backdrop-blur-xl bg-white/[0.03] border-b-2 border-border">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard"
            className="flex items-center gap-2 text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <span className="font-syne font-bold gradient-text">Playground</span>
        </div>

        {/* Language Tabs */}
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                language === lang.id
                  ? `bg-gradient-to-r ${lang.color} text-white border-2 border-white`
                  : 'bg-white/5 text-text-muted hover:bg-white/10'
              }`}
              style={language === lang.id ? { boxShadow: '2px 2px 0 white' } : {}}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-2 gap-0">
        
        {/* Left: Code Editor + Output */}
        <div className="flex flex-col border-r-2 border-border">
          
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <div className="w-3 h-3 rounded-full bg-yellow" />
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="ml-3 text-sm text-text-muted font-mono">
                  {language === 'javascript' ? 'main.js' : 
                   language === 'python' ? 'main.py' :
                   language === 'html' ? 'index.html' : 'style.css'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4 text-text-muted" />}
                </button>
                <button
                  onClick={clearCode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Clear code"
                >
                  <Trash2 className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-black/20 font-mono text-sm leading-relaxed resize-none focus:outline-none text-white"
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="h-48 flex flex-col border-t-2 border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-border">
              <span className="text-sm text-text-muted">▶ Output</span>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-1.5 bg-secondary text-black font-semibold rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run
              </button>
            </div>
            <div className="flex-1 p-4 bg-black/20 overflow-auto">
              <pre className="font-mono text-sm text-secondary whitespace-pre-wrap">
                {output || 'Click "Run" to see output...'}
              </pre>
            </div>
          </div>
        </div>

        {/* Right: AI Chat */}
        <div className="flex flex-col h-[calc(100vh-73px)]">
          
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary/10 border-b-2 border-primary">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <div className="font-semibold">AI Tutor</div>
              <div className="text-xs text-text-muted">Coding + English help</div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {isAiLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/5 rounded-xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t-2 border-border">
            <div className="flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything... (try making grammar mistakes!)"
                className="flex-1 px-4 py-3 bg-white/5 border-2 border-border rounded-xl text-white placeholder-text-muted focus:border-primary focus:outline-none transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isAiLoading}
                className="px-4 py-3 bg-primary rounded-xl hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2 text-center">
              💡 Tip: Ask questions with grammar mistakes - I'll help you fix them!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Chat Message Component */
const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-secondary' 
          : 'bg-gradient-to-br from-primary to-accent'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
        isUser 
          ? 'bg-secondary/20 border border-secondary/30' 
          : 'bg-white/5 border border-border'
      }`}>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  )
}

export default Playground