'use client'

import Dashboard from '@/components/Dashboard'
import { DashboardProvider } from '@/contexts/DashboardContext'

export default function Page() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}