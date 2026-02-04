import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle2, XCircle, Loader2, MapPin, Building2, Briefcase, GraduationCap, Mail, Phone, Linkedin } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { Candidate } from '@/data/candidates'
import { chat } from '@/lib/api'

// Evaluation criteria types
export type CriteriaStatus = 'met' | 'not_met' | 'unknown'

export interface EvaluationCriteria {
  id: string
  label: string
  status: CriteriaStatus
  reason?: string
}

interface CandidateProfilePanelProps {
  candidate: Candidate
  onClose?: () => void
  searchCriteria?: string[]
}

// Helper function to get initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// Default criteria to evaluate against
const defaultCriteria = [
  'Currently employed as a machine learning engineer',
  'Currently company operates in the artificial intelligence (AI) sector',
  'Based in the San Francisco Bay Area',
  'Has 5+ years of experience',
  'Has experience with distributed systems',
]

export function CandidateProfilePanel({
  candidate,
  onClose,
  searchCriteria,
}: CandidateProfilePanelProps) {
  const [generatedTags, setGeneratedTags] = useState<string[]>([])
  const [criteriaEvaluations, setCriteriaEvaluations] = useState<EvaluationCriteria[]>([])
  const [aiSummary, setAiSummary] = useState<string>('')
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  // Generate AI-powered tags and evaluations when candidate changes
  useEffect(() => {
    const generateAIInsights = async () => {
      setIsLoadingTags(true)
      setIsLoadingSummary(true)

      const candidateContext = `
Candidate: ${candidate.name}
Current Role: ${candidate.currentRole}
Current Company: ${candidate.currentCompany}
Location: ${candidate.location}
Years of Experience: ${candidate.yearsOfExperience}
Skills: ${candidate.skills.join(', ')}
Summary: ${candidate.summary}
Education: ${candidate.education.map((e) => `${e.degree} from ${e.school} (${e.year})`).join('; ')}
Experience: ${candidate.experience.map((e) => `${e.title} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.highlights.join(', ')}`).join('; ')}
      `.trim()

      // Generate summary with highlighted keywords
      try {
        const summaryResponse = await chat({
          messages: [
            {
              role: 'system',
              content: `You are an expert recruiter assistant. Generate a concise professional summary for candidates. 
Use **bold** formatting for key highlights like years of experience, key skills, technologies, and notable achievements. 
Keep it to 3-4 sentences maximum. Focus on what makes this candidate stand out.`,
            },
            {
              role: 'user',
              content: `Generate a professional summary for this candidate:\n\n${candidateContext}`,
            },
          ],
          temperature: 0.7,
        })
        setAiSummary(summaryResponse.message.content)
      } catch (error) {
        console.error('Failed to generate summary:', error)
        setAiSummary(candidate.summary)
      } finally {
        setIsLoadingSummary(false)
      }

      // Generate tags
      try {
        const tagsResponse = await chat({
          messages: [
            {
              role: 'system',
              content: `You are an expert recruiter. Extract 6-10 short, relevant tags from a candidate's profile. 
Tags should be single words or short phrases (2-3 words max) representing:
- Key technologies and tools
- Domain expertise
- Notable companies
- Education highlights
- Soft skills indicators
Return only a JSON array of strings, nothing else. Example: ["PyTorch", "Stanford PhD", "FAANG", "ML Infrastructure", "Team Lead"]`,
            },
            {
              role: 'user',
              content: `Extract tags from this candidate profile:\n\n${candidateContext}`,
            },
          ],
          temperature: 0.5,
        })
        
        const content = tagsResponse.message.content
        // Parse JSON from response, handling potential markdown code blocks
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const tags = JSON.parse(jsonMatch[0])
          setGeneratedTags(tags)
        }
      } catch (error) {
        console.error('Failed to generate tags:', error)
        // Fallback to skills as tags
        setGeneratedTags(candidate.skills.slice(0, 8))
      } finally {
        setIsLoadingTags(false)
      }

      // Evaluate criteria
      const criteriaToEvaluate = searchCriteria || defaultCriteria
      try {
        const evaluationResponse = await chat({
          messages: [
            {
              role: 'system',
              content: `You are an expert recruiter evaluating candidates against specific criteria.
For each criterion, determine if the candidate meets it based on their profile.
Return a JSON array with objects containing:
- "id": sequential number as string
- "label": the criterion text
- "status": "met" or "not_met"  
- "reason": brief explanation (1 sentence)

Be precise and base your evaluation strictly on the provided information.`,
            },
            {
              role: 'user',
              content: `Evaluate this candidate against the following criteria:

Candidate Profile:
${candidateContext}

Criteria to evaluate:
${criteriaToEvaluate.map((c, i) => `${i + 1}. ${c}`).join('\n')}`,
            },
          ],
          temperature: 0.3,
        })

        const content = evaluationResponse.message.content
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const evaluations = JSON.parse(jsonMatch[0])
          setCriteriaEvaluations(evaluations)
        }
      } catch (error) {
        console.error('Failed to evaluate criteria:', error)
        // Fallback to unknown status
        setCriteriaEvaluations(
          criteriaToEvaluate.map((label, index) => ({
            id: String(index + 1),
            label,
            status: 'unknown' as CriteriaStatus,
          }))
        )
      }
    }

    generateAIInsights()
  }, [candidate, searchCriteria])

  // Format summary with bold text
  const formatSummary = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm font-medium">
              {getInitials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{candidate.name}</h2>
            <p className="text-sm text-muted-foreground">
              {candidate.currentRole} at {candidate.currentCompany}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {candidate.location}
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 flex-shrink-0">
          <TabsList>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="notes">Notes and comments</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="info" className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {/* AI Summary */}
          <div className="space-y-3 mt-4">
            <h3 className="font-semibold">Summary</h3>
            {isLoadingSummary ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{formatSummary(aiSummary)}</p>
            )}
          </div>

          <Separator className="my-6" />

          {/* Criteria Evaluations */}
          <div className="space-y-3">
            <h3 className="font-semibold">Criteria evaluations</h3>
            <div className="space-y-2">
              {criteriaEvaluations.length === 0 ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                criteriaEvaluations.map((criteria) => (
                  <div
                    key={criteria.id}
                    className="flex items-start gap-2 text-sm"
                    title={criteria.reason}
                  >
                    {criteria.status === 'met' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : criteria.status === 'not_met' ? (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Loader2 className="h-5 w-5 text-muted-foreground animate-spin flex-shrink-0 mt-0.5" />
                    )}
                    <span className={criteria.status === 'not_met' ? 'text-muted-foreground' : ''}>
                      {criteria.label}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* AI Generated Tags */}
          <div className="space-y-3">
            <h3 className="font-semibold">AI-Generated Tags</h3>
            {isLoadingTags ? (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {generatedTags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${candidate.email}`} className="text-primary hover:underline">
                  {candidate.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`https://${candidate.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {candidate.linkedin}
                </a>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Experience */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </h3>
            <div className="space-y-4">
              {candidate.experience.map((exp, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-medium text-sm">{exp.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    {exp.company} · {exp.location}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {exp.startDate} - {exp.endDate}
                  </div>
                  <ul className="text-sm list-disc list-inside pl-2 space-y-1 mt-2">
                    {exp.highlights.slice(0, 2).map((highlight, i) => (
                      <li key={i} className="text-muted-foreground">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Education */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </h3>
            <div className="space-y-3">
              {candidate.education.map((edu, index) => (
                <div key={index} className="space-y-0.5">
                  <div className="font-medium text-sm">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground">
                    {edu.school} · {edu.year}
                  </div>
                  {edu.focus && (
                    <div className="text-xs text-muted-foreground">Focus: {edu.focus}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fit Level Indicator */}
          <Separator className="my-6" />
          <div className="space-y-3">
            <h3 className="font-semibold">Fit Assessment</h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  candidate.fitLevel === 'strong'
                    ? 'default'
                    : candidate.fitLevel === 'good'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {candidate.fitLevel === 'strong'
                  ? '🌟 Strong Fit'
                  : candidate.fitLevel === 'good'
                  ? '👍 Good Fit'
                  : '⚠️ Weak Fit'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {candidate.yearsOfExperience} years of experience
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          <div className="mt-4 text-sm text-muted-foreground">
            <p>No notes or comments yet.</p>
            <Button variant="outline" className="mt-4">
              Add a note
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          <div className="mt-4 space-y-4">
            <div className="text-sm text-muted-foreground">Recent activity will appear here.</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                <div>
                  <div className="font-medium">Profile viewed</div>
                  <div className="text-muted-foreground">Today at 2:30 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <div className="font-medium">Added to candidate pool</div>
                  <div className="text-muted-foreground">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

