// app/dashboard/admin/layout.tsx
import RoleGuard from '@/components/auth/RoleGuard'
import { ReactNode } from 'react'

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      {children}
    </RoleGuard>
  )
}