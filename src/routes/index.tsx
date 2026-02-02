import { createBrowserRouter } from 'react-router'
import { Home, CandidateDetail } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/candidate/:id',
    element: <CandidateDetail />,
  },
])

