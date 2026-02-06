import { createBrowserRouter } from 'react-router'
import { 
  CandidateDetail, 
  CandidateSearchResults,
  Jobs, 
  Candidates, 
  Interviews, 
  Analytics, 
  Settings,
  Components,
  AllCandidates,
  Messaged,
  Replied,
  Interviewing,
  HiredRejected,
  NotInterested,
} from '@/pages'
import { Layout } from '@/components/Layout'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Candidates />,
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
        path: '/candidates/all',
        element: <AllCandidates />,
      },
      {
        path: '/candidates/search',
        element: <CandidateSearchResults />,
      },
      {
        path: '/candidates/messaged',
        element: <Messaged />,
      },
      {
        path: '/candidates/replied',
        element: <Replied />,
      },
      {
        path: '/candidates/interviewing',
        element: <Interviewing />,
      },
      {
        path: '/candidates/hired-rejected',
        element: <HiredRejected />,
      },
      {
        path: '/candidates/not-interested',
        element: <NotInterested />,
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
      {
        path: '/components',
        element: <Components />,
      },
    ],
  },
])

