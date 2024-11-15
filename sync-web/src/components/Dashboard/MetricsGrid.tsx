'use client'

import { Card } from '@/components/ui/card'
import { useDashboard } from '@/contexts/DashboardContext'

export function MetricsGrid() {
  const { metrics } = useDashboard()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, i) => {
        const Icon = metric.icon
        return (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                {metric.trend}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{metric.value}</h3>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}