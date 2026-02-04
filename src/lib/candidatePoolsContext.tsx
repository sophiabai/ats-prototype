import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface CandidatePool {
  id: string
  title: string
  query: string
  resultCount: number
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  icon: 'folder' | 'folder-open'
  pools: string[] // pool ids
  children?: Project[]
}

interface CandidatePoolsContextType {
  pools: CandidatePool[]
  projects: Project[]
  addPool: (pool: Omit<CandidatePool, 'id' | 'createdAt'>) => string
  removePool: (id: string) => void
  addPoolToProject: (poolId: string, projectId: string) => void
  removePoolFromProject: (poolId: string, projectId: string) => void
}

const CandidatePoolsContext = createContext<CandidatePoolsContextType | null>(null)

// Initial mock data
const initialPools: CandidatePool[] = [
  {
    id: 'pool-1',
    title: 'Bay area ML engineers ope...',
    query: 'bay area ml engineers open for work',
    resultCount: 1000,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'pool-2',
    title: 'SF SaaS product designer...',
    query: 'SF SaaS product designers',
    resultCount: 450,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'pool-3',
    title: 'Seattle SaaS product man...',
    query: 'Seattle SaaS product managers',
    resultCount: 320,
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'pool-4',
    title: 'AI product designers open...',
    query: 'AI product designers open to work',
    resultCount: 280,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'pool-5',
    title: 'SF Growth product design...',
    query: 'SF Growth product designers',
    resultCount: 195,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 'pool-6',
    title: 'NYC Full-stack engineers...',
    query: 'NYC Full-stack engineers open to opportunities',
    resultCount: 520,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'pool-7',
    title: 'Austin DevOps engineers...',
    query: 'Austin DevOps engineers with Kubernetes experience',
    resultCount: 180,
    createdAt: new Date('2024-01-18'),
  },
  {
    id: 'pool-8',
    title: 'Remote Data scientists...',
    query: 'Remote Data scientists Python R',
    resultCount: 340,
    createdAt: new Date('2024-01-12'),
  },
]

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Product Manager',
    icon: 'folder',
    pools: [],
  },
  {
    id: 'proj-2',
    name: 'Product Designer',
    icon: 'folder-open',
    pools: [],
    children: [
      { id: 'proj-2-1', name: 'Bay area PD open for...', icon: 'folder', pools: [] },
      { id: 'proj-2-2', name: 'Growth designers', icon: 'folder', pools: [] },
      { id: 'proj-2-3', name: 'PD with SaaS backgro...', icon: 'folder', pools: [] },
    ],
  },
]

export function CandidatePoolsProvider({ children }: { children: ReactNode }) {
  const [pools, setPools] = useState<CandidatePool[]>(initialPools)
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  const addPool = useCallback((pool: Omit<CandidatePool, 'id' | 'createdAt'>) => {
    const id = `pool-${Date.now()}`
    const newPool: CandidatePool = {
      ...pool,
      id,
      createdAt: new Date(),
    }
    setPools(prev => [newPool, ...prev])
    return id
  }, [])

  const removePool = useCallback((id: string) => {
    setPools(prev => prev.filter(p => p.id !== id))
    // Also remove from all projects
    setProjects(prev => prev.map(proj => ({
      ...proj,
      pools: proj.pools.filter(poolId => poolId !== id),
      children: proj.children?.map(child => ({
        ...child,
        pools: child.pools.filter(poolId => poolId !== id),
      })),
    })))
  }, [])

  const addPoolToProject = useCallback((poolId: string, projectId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return { ...proj, pools: [...proj.pools, poolId] }
      }
      if (proj.children) {
        return {
          ...proj,
          children: proj.children.map(child => 
            child.id === projectId 
              ? { ...child, pools: [...child.pools, poolId] }
              : child
          ),
        }
      }
      return proj
    }))
  }, [])

  const removePoolFromProject = useCallback((poolId: string, projectId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return { ...proj, pools: proj.pools.filter(id => id !== poolId) }
      }
      if (proj.children) {
        return {
          ...proj,
          children: proj.children.map(child => 
            child.id === projectId 
              ? { ...child, pools: child.pools.filter(id => id !== poolId) }
              : child
          ),
        }
      }
      return proj
    }))
  }, [])

  return (
    <CandidatePoolsContext.Provider value={{
      pools,
      projects,
      addPool,
      removePool,
      addPoolToProject,
      removePoolFromProject,
    }}>
      {children}
    </CandidatePoolsContext.Provider>
  )
}

export function useCandidatePools() {
  const context = useContext(CandidatePoolsContext)
  if (!context) {
    throw new Error('useCandidatePools must be used within CandidatePoolsProvider')
  }
  return context
}

