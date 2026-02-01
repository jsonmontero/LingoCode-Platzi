import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Background from '../components/Background'
import { ChevronRight, ChevronLeft, CheckCircle, Code, Languages } from 'lucide-react'

const QUESTIONS = [
  // English Questions (5)
  {
    id: 1,
    type: 'english',
    question: 'Choose the correct sentence:',
    options: [
      'She don\'t like coffee.',
      'She doesn\'t likes coffee.',
      'She doesn\'t like coffee.',
      'She not like coffee.'
    ],
    correct: 2
  },
  {
    id: 2,
    type: 'english',
    question: 'Fill in the blank: "I _____ to the store yesterday."',
    options: ['go', 'went', 'going', 'gone'],
    correct: 1
  },
  {
    id: 3,
    type: 'english',
    question: 'Which sentence is correct?',
    options: [
      'How I can help you?',
      'How can I help you?',
      'How I help you can?',
      'Can how I help you?'
    ],
    correct: 1
  },
  {
    id: 4,
    type: 'english',
    question: 'Choose the correct word: "This is _____ interesting book."',
    options: ['a', 'an', 'the', 'no article needed'],
    correct: 1
  },
  {
    id: 5,
    type: 'english',
    question: 'What does "debug" mean in programming?',
    options: [
      'Add new features',
      'Find and fix errors',
      'Delete code',
      'Write documentation'
    ],
    correct: 1
  },
  // Programming Questions (5)
  {
    id: 6,
    type: 'programming',
    question: 'What is a variable in programming?',
    options: [
      'A type of loop',
      'A container that stores data',
      'A function name',
      'A programming language'
    ],
    correct: 1
  },
  {
    id: 7,
    type: 'programming',
    question: 'What will this code print?\n\nprint(2 + 3)',
    options: ['23', '5', '2 + 3', 'Error'],
    correct: 1
  },
  {
    id: 8,
    type: 'programming',
    question: 'What is a "loop" used for?',
    options: [
      'To stop the program',
      'To repeat code multiple times',
      'To store data',
      'To create errors'
    ],
    correct: 1
  },
  {
    id: 9,
    type: 'programming',
    question: 'Which is a correct way to write a comment in Python?',
    options: [
      '// This is a comment',
      '/* This is a comment */',
      '# This is a comment',
      '-- This is a comment'
    ],
    correct: 2
  },
  {
    id: 10,
    type: 'programming',
    question: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Home Tool Markup Language',
      'Hyperlink Text Making Language'
    ],
    correct: 0
  }
]

const Assessment = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [saving, setSaving] = useState(false)

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  const handleAnswer = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: optionIndex
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculateResults()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateResults = async () => {
    setSaving(true)
    
    // Calculate English score
    const englishQuestions = QUESTIONS.filter(q => q.type === 'english')
    const englishCorrect = englishQuestions.filter(q => answers[q.id] === q.correct).length
    const englishPercent = (englishCorrect / englishQuestions.length) * 100
    
    // Calculate Programming score
    const progQuestions = QUESTIONS.filter(q => q.type === 'programming')
    const progCorrect = progQuestions.filter(q => answers[q.id] === q.correct).length
    const progPercent = (progCorrect / progQuestions.length) * 100

    // Determine levels
    let englishLevel = 'A2'
    if (englishPercent >= 80) englishLevel = 'B2'
    else if (englishPercent >= 60) englishLevel = 'B1'
    
    let programmingLevel = 'none'
    if (progPercent >= 80) programmingLevel = 'intermediate'
    else if (progPercent >= 40) programmingLevel = 'basic'

    // Save to Supabase
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          english_level: englishLevel,
          programming_level: programmingLevel,
          assessment_completed: true,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving profile:', error)
      }
    } catch (err) {
      console.error('Error:', err)
    }

    setSaving(false)
    setShowResults({
      englishCorrect,
      englishTotal: englishQuestions.length,
      englishLevel,
      progCorrect,
      progTotal: progQuestions.length,
      programmingLevel
    })
  }

  // Results Screen
  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Background />
        
        <div className="w-full max-w-lg fade-in">
          <div className="glass-card p-8 md:p-10 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="font-syne text-2xl font-bold mb-2">Assessment Complete!</h1>
            <p className="text-text-muted mb-8">Here's what we learned about you:</p>

            {/* Results Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-primary/20 border-2 border-primary rounded-xl p-4">
                <Languages className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{showResults.englishLevel}</div>
                <div className="text-sm text-text-muted">English Level</div>
                <div className="text-xs mt-2 text-primary">
                  {showResults.englishCorrect}/{showResults.englishTotal} correct
                </div>
              </div>
              
              <div className="bg-secondary/20 border-2 border-secondary rounded-xl p-4">
                <Code className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold capitalize">{showResults.programmingLevel}</div>
                <div className="text-sm text-text-muted">Coding Level</div>
                <div className="text-xs mt-2 text-secondary">
                  {showResults.progCorrect}/{showResults.progTotal} correct
                </div>
              </div>
            </div>

            <p className="text-sm text-text-muted mb-6">
              Your learning path has been personalized based on these results!
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn-neu btn-primary w-full"
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Background />
      
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-text-muted mb-2">
            <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-border">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card p-8 md:p-10 fade-in">
          {/* Question Type Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mb-6 ${
            question.type === 'english' 
              ? 'bg-primary/20 text-primary' 
              : 'bg-secondary/20 text-secondary'
          }`}>
            {question.type === 'english' ? (
              <>
                <Languages className="w-4 h-4" />
                English
              </>
            ) : (
              <>
                <Code className="w-4 h-4" />
                Programming
              </>
            )}
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-semibold mb-8 whitespace-pre-line">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[question.id] === idx
                    ? 'bg-primary/20 border-primary'
                    : 'bg-white/5 border-border hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[question.id] === idx
                      ? 'border-primary bg-primary'
                      : 'border-text-muted'
                  }`}>
                    {answers[question.id] === idx && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-mono text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border-2 border-border rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={nextQuestion}
              disabled={answers[question.id] === undefined || saving}
              className="btn-neu btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : currentQuestion === QUESTIONS.length - 1 ? 'See Results' : 'Next'}
              {!saving && <ChevronRight className="w-5 h-5 inline ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assessment