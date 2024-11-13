export type PlanType = 'course' | 'project' | 'workout' | 'custom'

export interface TimelineItem {
  id: string
  title: string
  date?: string // Optional as some items might not have dates
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked'
  type: string // Flexible type (e.g., 'assignment', 'deliverable', 'exercise', etc.)
  description?: string
  priority?: 'low' | 'medium' | 'high'
  dependencies?: string[] // IDs of items this depends on
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
  overview: string // Rich text overview/notes
  rawData?: any // Original scraped/imported data
}