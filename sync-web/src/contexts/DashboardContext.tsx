'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { 
  BarChart, 
  Clock, 
  CheckCircle, 
  Target 
} from 'lucide-react'

interface Metric {
  label: string
  value: string
  trend: string
  icon: any
  color: string
}

interface DashboardContextType {
  metrics: Metric[]
  updateMetric: (index: number, updates: Partial<Metric>) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: "Progress",
      value: "38%",
      trend: "+5%",
      icon: BarChart,
      color: "from-purple-500 to-indigo-600"
    },
    {
      label: "Current Phase",
      value: "Phase 2",
      trend: "On Track",
      icon: Target,
      color: "from-emerald-500 to-teal-600"
    },
    {
      label: "Items",
      value: "12/32",
      trend: "2 due soon",
      icon: CheckCircle,
      color: "from-pink-500 to-rose-600"
    },
    {
      label: "Time Spent",
      value: "24h",
      trend: "8h this week",
      icon: Clock,
      color: "from-blue-500 to-cyan-600"
    }
  ])

  const updateMetric = (index: number, updates: Partial<Metric>) => {
    setMetrics(prev => prev.map((metric, i) => 
      i === index ? { ...metric, ...updates } : metric
    ))
  }

  return (
    <DashboardContext.Provider value={{ metrics, updateMetric }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}