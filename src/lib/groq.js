const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export const askAI = async (userMessage, context = {}) => {
  const { englishLevel = 'B1', programmingLevel = 'beginner', currentLesson = 'general' } = context

  const systemPrompt = `You are LingoCode's AI tutor. You teach programming and correct English.

RULES:
1. Keep responses under 150 words
2. If the user writes in incorrect English, correct it inline using: 📝 "[corrected sentence]"
3. Add a brief grammar tip with 💡 only if relevant
4. Use simple English (A2-B2 level)
5. Include code examples when helpful
6. Be encouraging and friendly

User's level: ${englishLevel} English, ${programmingLevel} programming
Current lesson: ${currentLesson}`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return { 
      success: true, 
      message: data.choices[0].message.content 
    }
  } catch (error) {
    console.error('Groq API error:', error)
    return { 
      success: false, 
      message: "AI tutor is taking a break! Please try again in a moment." 
    }
  }
}