import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// POST /api/chat - Mirror of Vercel serverless function
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' })
  }

  const { messages, model = 'gpt-4o', temperature } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  try {
    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model,
      messages,
      ...(temperature !== undefined && { temperature }),
    })

    const responseMessage = completion.choices[0]?.message

    return res.status(200).json({
      message: responseMessage,
      usage: completion.usage,
    })
  } catch (error) {
    console.error('OpenAI API error:', error)

    if (error instanceof OpenAI.APIError) {
      return res.status(error.status || 500).json({
        error: error.message,
        code: error.code,
      })
    }

    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})

