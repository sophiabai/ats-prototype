import { createBrowserRouter } from 'react-router'
import { 
  CandidateDetail, 
  CandidateSearchResults,
  Overview, 
  Jobs, 
  Candidates, 
  Interviews, 
  Analytics, 
  Settings 
} from '@/pages'
import { Layout } from '@/components/Layout'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Overview />,
      },
      {
        path: '/jobs',
        element: <Jobs />,
      },
      {
        path: '/candidates',
        element: <Candidates />,
      },
      {
        path: '/candidates/search',
        element: <CandidateSearchResults />,
      },
      {
        path: '/candidate/:id',
        element: <CandidateDetail />,
      },
      {
        path: '/interviews',
        element: <Interviews />,
      },
      {
        path: '/analytics',
        element: <Analytics />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
])

