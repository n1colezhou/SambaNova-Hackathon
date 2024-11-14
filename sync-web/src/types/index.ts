export type PlanType = 'course' | 'project' | 'workout' | 'custom'

export interface TimelineItem {
  id: string
  title: string
  date?: string 
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked'
  type: string 
  description?: string
  priority?: 'low' | 'medium' | 'high'
  dependencies?: string[] 
}

export interface TimeBlock {
  id: string
  title: string
  startDate?: string
  endDate?: string
  items: TimelineItem[]
}

export interface Plan {
  id: string
  title: string
  type: PlanType
  description: string
  timeBlocks: TimeBlock[]
  overview: string 
  rawData?: any 
}

