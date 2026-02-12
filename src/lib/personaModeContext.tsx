import { createContext, useContext, useState, type ReactNode } from 'react'

export type Persona = 'super_admin' | 'recruiting_admin' | 'employee' | 'manager'
export type HomeMode = 'default' | 'payroll_week' | 'security_incident' | 'open_enrollment'

interface PersonaModeContextType {
  persona: Persona
  setPersona: (p: Persona) => void
  mode: HomeMode
  setMode: (m: HomeMode) => void
}

const PersonaModeContext = createContext<PersonaModeContextType | null>(null)

export function usePersonaMode() {
  const ctx = useContext(PersonaModeContext)
  if (!ctx) throw new Error('usePersonaMode must be used within PersonaModeProvider')
  return ctx
}

const PERSONA_LABELS: Record<Persona, string> = {
  super_admin: 'Super Admin',
  recruiting_admin: 'Recruiting Admin',
  employee: 'Employee',
  manager: 'Manager',
}

const MODE_LABELS: Record<HomeMode, string> = {
  default: 'Default',
  payroll_week: 'Payroll Week',
  security_incident: 'Security Incident',
  open_enrollment: 'Open Enrollment',
}

export { PERSONA_LABELS, MODE_LABELS }

export function PersonaModeProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>('super_admin')
  const [mode, setMode] = useState<HomeMode>('default')
  return (
    <PersonaModeContext.Provider value={{ persona, setPersona, mode, setMode }}>
      {children}
    </PersonaModeContext.Provider>
  )
}
