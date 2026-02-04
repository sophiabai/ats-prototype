import { chat } from './api'
import type { Candidate } from '@/data/candidates'
import { candidates } from '@/data/candidates'

export interface SearchCriterion {
  id: string
  description: string
  category: 'location' | 'role' | 'experience' | 'skills' | 'company' | 'education' | 'other'
}

export interface CandidateEvaluation {
  candidate: Candidate
  criteriaResults: {
    criterion: SearchCriterion
    met: boolean
    reason: string
  }[]
  metCount: number
  totalCriteria: number
}

export async function parseSearchPrompt(prompt: string): Promise<SearchCriterion[]> {
  const systemPrompt = `You are an expert at parsing job search queries into structured criteria.
Given a user's search prompt, break it down into individual, distinct criteria.

Each criterion should be:
- Clear and specific
- Independently evaluable
- Categorized appropriately

Categories:
- location: Geographic requirements (e.g., "based in the Bay Area", "remote-friendly")
- role: Job title or function requirements (e.g., "ML Engineer", "Senior level")
- experience: Years of experience or seniority (e.g., "5+ years experience")
- skills: Technical skills or technologies (e.g., "knows PyTorch", "experience with LLMs")
- company: Company type or specific companies (e.g., "FAANG experience", "startup background")
- education: Educational requirements (e.g., "PhD in CS", "Stanford graduate")
- other: Any other criteria

Return a JSON array of criteria objects with these fields:
- id: unique identifier (criterion_1, criterion_2, etc.)
- description: human-readable description of the criterion
- category: one of the categories above

Example input: "bay area ml eng with 5+ years"
Example output:
[
  {"id": "criterion_1", "description": "Based in the Bay Area", "category": "location"},
  {"id": "criterion_2", "description": "Machine Learning Engineer role or background", "category": "role"},
  {"id": "criterion_3", "description": "5 or more years of experience", "category": "experience"}
]

Return ONLY the JSON array, no other text.`

  const response = await chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    model: 'gpt-4o',
    temperature: 0.1
  })

  try {
    const content = response.message.content.trim()
    // Handle potential markdown code blocks
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('Failed to parse criteria:', error)
    throw new Error('Failed to parse search criteria')
  }
}

export async function evaluateCandidateAgainstCriteria(
  candidate: Candidate,
  criteria: SearchCriterion[]
): Promise<CandidateEvaluation['criteriaResults']> {
  const candidateInfo = `
Name: ${candidate.name}
Location: ${candidate.location}
Current Role: ${candidate.currentRole}
Current Company: ${candidate.currentCompany}
Years of Experience: ${candidate.yearsOfExperience}
Skills: ${candidate.skills.join(', ')}
Summary: ${candidate.summary}
Education: ${candidate.education.map(e => `${e.degree} from ${e.school} (${e.year})${e.focus ? ` - Focus: ${e.focus}` : ''}`).join('; ')}
Experience: ${candidate.experience.map(e => `${e.title} at ${e.company} (${e.location}) - ${e.startDate} to ${e.endDate}: ${e.highlights.join('; ')}`).join(' | ')}
`

  const systemPrompt = `You are an expert at evaluating job candidates against specific criteria.
Given a candidate's profile and a list of criteria, determine if each criterion is met.

Be fair but thorough in your evaluation:
- For location criteria, check if the candidate's location matches (Bay Area includes SF, Oakland, San Jose, Palo Alto, Mountain View, Menlo Park, etc.)
- For role criteria, check if their current role or past roles match
- For experience criteria, check years of experience
- For skills criteria, check their listed skills and work experience
- For company criteria, check their employment history
- For education criteria, check their educational background

Return a JSON array with one object per criterion:
{
  "criterion_id": "the criterion id",
  "met": true/false,
  "reason": "brief explanation why criterion is/isn't met"
}

Return ONLY the JSON array, no other text.`

  const userPrompt = `Candidate Profile:
${candidateInfo}

Criteria to evaluate:
${JSON.stringify(criteria, null, 2)}

Evaluate each criterion against this candidate.`

  const response = await chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: 'gpt-4o',
    temperature: 0.1
  })

  try {
    const content = response.message.content.trim()
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const results = JSON.parse(jsonStr)
    
    return criteria.map(criterion => {
      const result = results.find((r: { criterion_id: string }) => r.criterion_id === criterion.id)
      return {
        criterion,
        met: result?.met ?? false,
        reason: result?.reason ?? 'Unable to evaluate'
      }
    })
  } catch (error) {
    console.error('Failed to parse evaluation:', error)
    // Return all criteria as not met if parsing fails
    return criteria.map(criterion => ({
      criterion,
      met: false,
      reason: 'Evaluation failed'
    }))
  }
}

export async function summarizeSearchQuery(prompt: string): Promise<string> {
  const systemPrompt = `You are an expert at creating concise, descriptive titles for candidate searches.
Given a user's search query, create a short, professional title that summarizes what they're looking for.

Rules:
- Maximum 200 characters
- Be concise but descriptive
- Use title case
- Format like a candidate pool name (e.g., "Bay Area ML Engineers", "Senior Product Designers with SaaS Experience")
- Do not include phrases like "Search for" or "Looking for"

Return ONLY the title text, no quotes or other formatting.`

  const response = await chat({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    model: 'gpt-4o',
    temperature: 0.3
  })

  const title = response.message.content.trim()
  // Ensure it's under 200 characters
  return title.length > 200 ? title.substring(0, 197) + '...' : title
}

export interface SearchResult {
  evaluations: CandidateEvaluation[]
  title: string
  criteria: SearchCriterion[]
}

export async function searchCandidates(prompt: string): Promise<SearchResult> {
  // Step 1: Parse the prompt into criteria and get summarized title in parallel
  const [criteria, title] = await Promise.all([
    parseSearchPrompt(prompt),
    summarizeSearchQuery(prompt)
  ])
  
  if (criteria.length === 0) {
    throw new Error('No criteria could be extracted from the search prompt')
  }

  // Step 2: Evaluate all candidates against criteria
  const evaluations: CandidateEvaluation[] = await Promise.all(
    candidates.map(async (candidate) => {
      const criteriaResults = await evaluateCandidateAgainstCriteria(candidate, criteria)
      const metCount = criteriaResults.filter(r => r.met).length
      
      return {
        candidate,
        criteriaResults,
        metCount,
        totalCriteria: criteria.length
      }
    })
  )

  // Step 3: Filter out candidates with 0 met criteria and sort by metCount (descending)
  const filteredAndSorted = evaluations
    .filter(evaluation => evaluation.metCount > 0)
    .sort((a, b) => b.metCount - a.metCount)

  return {
    evaluations: filteredAndSorted,
    title,
    criteria
  }
}

