import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getModule, getLesson } from '../data/lessons'
import { askAI } from '../lib/groq'
import Background from '../components/Background'
import { 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  CheckCircle,
  Lightbulb,
  Send,
  Bot,
  Loader2,
  BookOpen
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const Lesson = () => {
  const { moduleId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)
  
  // AI Help
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const module = getModule(parseInt(moduleId))
  const lesson = getLesson(parseInt(moduleId), parseInt(lessonId))

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (lesson?.exercise) {
      setCode(lesson.exercise.starterCode)
      setOutput('')
      setCompleted(false)
      setShowHint(false)
      setAiResponse('')
    }
  }, [lessonId, lesson])

  if (!module || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link to="/dashboard" className="btn-neu btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const runCode = async () => {
  setIsRunning(true)
  setOutput('')

  let newOutput = ''

  try {
    if (lesson.exercise.language === 'javascript') {
      const logs = []
      const originalLog = console.log
      console.log = (...args) => logs.push(args.join(' '))
      
      try {
        new Function(code)()
        newOutput = logs.join('\n') || 'Code executed successfully!'
      } catch (err) {
        newOutput = `Error: ${err.message}`
      }
      
      console.log = originalLog
    } 
    else if (lesson.exercise.language === 'python') {
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
      newOutput = data.run?.output || data.run?.stderr || 'No output'
    }
    else if (lesson.exercise.language === 'html') {
      newOutput = 'HTML code looks good! ✓'
    }
    else if (lesson.exercise.language === 'css') {
      newOutput = 'CSS code looks good! ✓'
    }
    else {
      newOutput = 'Code received!'
    }
  } catch (err) {
    newOutput = `Error: ${err.message}`
  }

  setOutput(newOutput)
  setIsRunning(false)

  // Check if solution is correct (flexible check)
  const codeLC = code.toLowerCase()
  const outputLC = newOutput.toLowerCase()
  let isCorrect = false

  // No errors
  if (outputLC.includes('error')) {
    isCorrect = false
  }
  // Python: Check if they used print and got output
  else if (lesson.exercise.language === 'python') {
    if (codeLC.includes('print') && newOutput.trim().length > 0) {
      isCorrect = true
    }
  }
  // JS: Check if they used console.log and got output
  else if (lesson.exercise.language === 'javascript') {
    if (codeLC.includes('console.log') && newOutput.trim().length > 0) {
      isCorrect = true
    }
  }
  // HTML: Check if they have required tags
  else if (lesson.exercise.language === 'html') {
    if (codeLC.includes('<h1>') || codeLC.includes('<p>')) {
      isCorrect = true
    }
  }
  // CSS: Check if they have styling
  else if (lesson.exercise.language === 'css') {
    if (codeLC.includes('background') || codeLC.includes('color')) {
      isCorrect = true
    }
  }

  if (isCorrect && !completed) {
    setCompleted(true)
    // Save progress to database
    saveProgress()
  }
}

  const askForHelp = async () => {
    if (!aiQuestion.trim()) return
    
    setAiLoading(true)
    const response = await askAI(
      `I'm learning ${lesson.title}. My question: ${aiQuestion}\n\nThe exercise is: ${lesson.exercise.instruction}`,
      { currentLesson: lesson.title }
    )
    setAiResponse(response.message)
    setAiLoading(false)
    setAiQuestion('')
  }

  const nextLesson = () => {
    const nextLessonId = parseInt(lessonId) + 1
    const nextLessonExists = module.lessons.find(l => l.id === nextLessonId)
    
    if (nextLessonExists) {
      navigate(`/lesson/${moduleId}/${nextLessonId}`)
    } else {
      navigate('/dashboard')
    }
  }

  const prevLesson = () => {
    const prevLessonId = parseInt(lessonId) - 1
    if (prevLessonId >= 1) {
      navigate(`/lesson/${moduleId}/${prevLessonId}`)
    }
  }

  return (
    <div className="min-h-screen">
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
          <div>
            <div className="text-xs text-text-muted">Module {moduleId}</div>
            <div className="font-semibold text-sm">{lesson.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">
            Lesson {lessonId} of {module.lessons.length}
          </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-73px)]">
        
        {/* Left: Lesson Content */}
        <div className="overflow-y-auto border-r-2 border-border p-6 md:p-8 max-h-[calc(100vh-73px)]">
          <div 
            className="lesson-content"
            dangerouslySetInnerHTML={{ 
              __html: formatMarkdown(lesson.content) 
            }} 
          />
        </div>

        {/* Right: Exercise + Code */}
        <div className="flex flex-col max-h-[calc(100vh-73px)]">
          
          {/* Exercise Instructions */}
          <div className="p-4 bg-primary/10 border-b-2 border-primary">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold mb-1">Exercise</div>
                <p className="text-sm text-text-muted">{lesson.exercise.instruction}</p>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-border">
              <span className="text-sm text-text-muted font-mono">
                {lesson.exercise.language === 'python' ? 'main.py' : 
                 lesson.exercise.language === 'javascript' ? 'main.js' :
                 lesson.exercise.language === 'html' ? 'index.html' : 'style.css'}
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-xs text-yellow hover:text-yellow/80"
              >
                <Lightbulb className="w-4 h-4" />
                Hint
              </button>
            </div>

            {showHint && (
              <div className="px-4 py-3 bg-yellow/10 border-b border-yellow/30 text-sm">
                💡 {lesson.exercise.hint}
              </div>
            )}
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-black/20 font-mono text-sm leading-relaxed resize-none focus:outline-none min-h-[150px]"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="border-t-2 border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-border">
              <span className="text-sm text-text-muted">Output</span>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-1.5 bg-secondary text-black font-semibold rounded-lg hover:bg-secondary/80 disabled:opacity-50"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Run
              </button>
            </div>
            <div className="p-4 bg-black/20 min-h-[80px] max-h-[120px] overflow-auto">
              <pre className="font-mono text-sm text-secondary whitespace-pre-wrap">
                {output || 'Click "Run" to see output...'}
              </pre>
            </div>
          </div>

          {/* Success Message */}
          {completed && (
            <div className="p-4 bg-secondary/20 border-t-2 border-secondary flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-secondary" />
                <span className="font-semibold">Great job! Exercise completed!</span>
              </div>
              <button onClick={nextLesson} className="btn-neu btn-primary text-sm">
                Next Lesson <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}

          {/* AI Help Section */}
          <div className="p-4 border-t-2 border-border bg-black/20">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Need help? Ask AI Tutor</span>
            </div>
            
            {aiResponse && (
              <div className="mb-3 p-3 bg-primary/10 rounded-xl text-sm border border-primary/30">
                {aiResponse}
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askForHelp()}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 bg-white/5 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
              />
              <button
                onClick={askForHelp}
                disabled={aiLoading || !aiQuestion.trim()}
                className="px-3 py-2 bg-primary rounded-lg hover:bg-primary/80 disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between p-4 border-t-2 border-border">
            <button
              onClick={prevLesson}
              disabled={parseInt(lessonId) <= 1}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={nextLesson}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper to escape HTML in code
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Simple markdown formatter
function formatMarkdown(text) {
  const codeBlocks = []
  let html = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    codeBlocks.push(`<pre class="code-block"><code>${escapeHtml(code.trim())}</code></pre>`)
    return `%%CODEBLOCK${codeBlocks.length - 1}%%`
  })

  const inlineCodes = []
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    inlineCodes.push(`<code class="inline-code">${escapeHtml(code)}</code>`)
    return `%%INLINECODE${inlineCodes.length - 1}%%`
  })

  html = html.replace(/(\|.+\|[\r\n]+)+/g, (tableMatch) => {
    const rows = tableMatch.trim().split('\n').filter(row => row.trim())
    let tableHtml = '<table>'
    
    rows.forEach((row, index) => {
      if (row.match(/^\|[\s\-:|]+\|$/)) return
      
      const cells = row.split('|').filter(c => c !== '')
      const cellTag = index === 0 ? 'th' : 'td'
      
      tableHtml += '<tr>'
      cells.forEach(cell => {
        tableHtml += `<${cellTag}>${cell.trim()}</${cellTag}>`
      })
      tableHtml += '</tr>'
    })
    
    tableHtml += '</table>'
    return tableHtml
  })

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\s*)+/g, '<ul>$&</ul>')
  html = html.replace(/\n\n+/g, '<br/><br/>')
  html = html.replace(/\n/g, '<br/>')

  codeBlocks.forEach((block, i) => {
    html = html.replace(`%%CODEBLOCK${i}%%`, block)
  })

  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINECODE${i}%%`, code)
  })

  const saveProgress = async () => {
  console.log('Saving progress...', { userId: user.id, moduleId, lessonId })
  try {
    const { data, error } = await supabase.from('progress').upsert({
      user_id: user.id,
      module_id: parseInt(moduleId),
      lesson_id: parseInt(lessonId),
      completed: true,
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,module_id,lesson_id'
    })
    
    if (error) {
      console.error('Supabase error:', error)
    } else {
      console.log('Progress saved!', data)
    }
  } catch (err) {
    console.error('Error saving progress:', err)
  }
}


  return html
}

export default Lesson