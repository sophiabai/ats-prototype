import { createBrowserRouter, Navigate } from 'react-router'
import { 
  Home,
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
import { HomeLayout } from '@/components/HomeLayout'

export const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/home" replace />,
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

