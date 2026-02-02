import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Home() {
  // Placeholder candidate IDs for testing navigation
  const placeholderCandidates = ['1', '2', '3']

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate List</h1>
      <p className="text-muted-foreground mb-6">
        This is a placeholder for the candidate list view.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {placeholderCandidates.map((id) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle>Candidate {id}</CardTitle>
              <CardDescription>Placeholder candidate data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={`/candidate/${id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
