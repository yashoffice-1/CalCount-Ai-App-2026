'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

export type TopRole = 'admin' | 'super_admin'
export type AdminSubRole = 'Admin' | 'Support' | 'Viewer'
export type ApprovalStatus = 'approved' | 'pending' | 'rejected'

export type AuthUser = {
  id: string
  name: string
  email: string
  topRole: TopRole
  approvalStatus: ApprovalStatus
  subRole?: AdminSubRole // only for topRole='admin'
  createdAtISO: string
}

export type SignupPayload = {
  name: string
  email: string
  password?: string
  requestedSubRole: AdminSubRole
}

type AuthContextValue = {
  user: AuthUser | null
  viewMode: TopRole // 'admin' or 'super_admin' for UI rendering
  pendingAdmins: AuthUser[]
  approvedAdmins: AuthUser[]
  rejectedAdmins: AuthUser[]
  tenants: { id: string; name: string }[]
  loginByEmail: (email: string, password?: string) => void
  logout: () => void
  signup: (payload: SignupPayload) => void
  switchViewMode: (mode: TopRole) => void
  approvePendingAdmin: (userId: string, roleOverride?: AdminSubRole) => void
  rejectPendingAdmin: (userId: string) => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function nowISO() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

/** Fixed timestamps so SSR and hydration see identical demo user data. */
const DEMO_USER_CREATED_AT = '2026-01-15T12:00:00.000Z'

const TEAMS = [
  { id: 't_aurora', name: 'Aurora Labs' },
  { id: 't_northwind', name: 'Northwind Finance' },
]

const initialUsers: AuthUser[] = [
  {
    id: 'u_super_1',
    name: 'Priya (Super Admin)',
    email: 'super@calcount.ai',
    topRole: 'super_admin',
    approvalStatus: 'approved',
    createdAtISO: DEMO_USER_CREATED_AT,
  },
  {
    id: 'u_admin_1',
    name: 'Dev (Admin)',
    email: 'admin@calcount.ai',
    topRole: 'admin',
    approvalStatus: 'approved',
    subRole: 'Admin',
    createdAtISO: DEMO_USER_CREATED_AT,
  },
  {
    id: 'u_support_1',
    name: 'Sara (Support)',
    email: 'support@calcount.ai',
    topRole: 'admin',
    approvalStatus: 'approved',
    subRole: 'Support',
    createdAtISO: DEMO_USER_CREATED_AT,
  },
  {
    id: 'u_pending_1',
    name: 'New Hire (Pending)',
    email: 'pending@calcount.ai',
    topRole: 'admin',
    approvalStatus: 'pending',
    subRole: 'Viewer',
    createdAtISO: DEMO_USER_CREATED_AT,
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [users, setUsers] = React.useState<AuthUser[]>(() => initialUsers)
  const [sessionUserId, setSessionUserId] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<TopRole>('admin')

  React.useEffect(() => {
    try {
      const id = window.localStorage.getItem('sessionUserId')
      if (id) setSessionUserId(id)
    } catch {
      /* ignore */
    }
  }, [])

  const user = React.useMemo(
    () => users.find((u) => u.id === sessionUserId) ?? null,
    [sessionUserId, users]
  )

  React.useEffect(() => {
    if (!user) return
    setViewMode(user.topRole === 'super_admin' ? 'super_admin' : 'admin')
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const pendingAdmins = React.useMemo(
    () => users.filter((u) => u.topRole === 'admin' && u.approvalStatus === 'pending'),
    [users]
  )
  const approvedAdmins = React.useMemo(
    () => users.filter((u) => u.topRole === 'admin' && u.approvalStatus === 'approved'),
    [users]
  )
  const rejectedAdmins = React.useMemo(
    () => users.filter((u) => u.topRole === 'admin' && u.approvalStatus === 'rejected'),
    [users]
  )

  const loginByEmail = React.useCallback(
    (email: string, password?: string) => {
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (!found) return
      setSessionUserId(found.id)
      window.localStorage.setItem('sessionUserId', found.id)

      if (found.approvalStatus === 'pending') router.push('/approval')
      else if (found.topRole === 'super_admin') router.push('/super/system-control')
      else router.push('/admin/dashboard')
    },
    [router, users]
  )

  const logout = React.useCallback(() => {
    setSessionUserId(null)
    window.localStorage.removeItem('sessionUserId')
    router.push('/login')
  }, [router])

  const signup = React.useCallback(
    (payload: SignupPayload) => {
      // Dummy: keep everything in memory.
      const newUser: AuthUser = {
        id: uid('u_pending'),
        name: payload.name,
        email: payload.email,
        topRole: 'admin',
        approvalStatus: 'pending',
        subRole: payload.requestedSubRole,
        createdAtISO: nowISO(),
      }

      setUsers((prev) => [newUser, ...prev])
      setSessionUserId(newUser.id)
      window.localStorage.setItem('sessionUserId', newUser.id)
      router.push('/approval')
    },
    [router]
  )

  const switchViewMode = React.useCallback(
    (mode: TopRole) => {
      if (!user) return
      if (user.topRole !== 'super_admin') {
        setViewMode('admin')
        return
      }
      setViewMode(mode)
      if (mode === 'admin') router.push('/admin/dashboard')
      if (mode === 'super_admin') router.push('/super/system-control')
    },
    [router, user]
  )

  const approvePendingAdmin = React.useCallback(
    (userId: string, roleOverride?: AdminSubRole) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u
          return {
            ...u,
            subRole: roleOverride ?? u.subRole,
            approvalStatus: 'approved',
          }
        })
      )
    },
    []
  )

  const rejectPendingAdmin = React.useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              approvalStatus: 'rejected',
            }
          : u
      )
    )
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      viewMode,
      pendingAdmins,
      approvedAdmins,
      rejectedAdmins,
      tenants: TEAMS,
      loginByEmail,
      logout,
      signup,
      switchViewMode,
      approvePendingAdmin,
      rejectPendingAdmin,
    }),
    [
      user,
      viewMode,
      pendingAdmins,
      approvedAdmins,
      rejectedAdmins,
      loginByEmail,
      logout,
      signup,
      switchViewMode,
      approvePendingAdmin,
      rejectPendingAdmin,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

