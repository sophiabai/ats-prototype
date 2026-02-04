import { useParams, Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CandidateDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="h-full overflow-auto">
      <Button variant="outline" asChild className="mb-4 text-xs sm:text-sm">
        <Link to="/">← Back to Candidates</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Candidate {id}</CardTitle>
          <CardDescription>Candidate detail placeholder</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for the candidate detail view. 
            The candidate ID from the URL is: <strong>{id}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

