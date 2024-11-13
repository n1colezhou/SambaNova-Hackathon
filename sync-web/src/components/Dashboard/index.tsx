'use client'

import { Timeline } from './Timeline'
import { Sidebar } from './Sidebar'
import { Editor } from '../Overview/Editor'
import { MetricsGrid } from './MetricsGrid'
import { CalendarView } from './Calendar/CalendarView'
import { Card } from '@/components/ui/card'

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <MetricsGrid />
          </div>
          
          <div className="grid grid-cols-5 gap-6">
          <div className="col-span-1">
          <h1 className="text-2xl font-bold mb-6">Calendar</h1>
              <CalendarView />
            </div>
            <div className="col-span-4">
              <Timeline />
            </div>
            
          </div>

            <h1 className="text-2xl font-semibold mb-4">The Roadmap</h1>
            <Editor />
        </div>
      </div>
    </div>
  )
}