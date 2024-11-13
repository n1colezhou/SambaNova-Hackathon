'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: Date
  type: 'task' | 'quiz' | 'project' | 'meeting'
  status: 'not-started' | 'in-progress' | 'completed'
  description?: string
  duration?: string
}

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Sample events
  const events: Event[] = [
    {
      id: '1',
      title: 'React Components Assignment',
      date: new Date(2024, 10, 15),
      type: 'task',
      status: 'completed',
      description: 'Create reusable React components following best practices',
      duration: '2 hours'
    },
    {
      id: '2',
      title: 'State Management Quiz',
      date: new Date(2024, 10, 18),
      type: 'quiz',
      status: 'not-started',
      description: 'Quiz covering Redux and Context API',
      duration: '1 hour'
    },
  ]

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-500'
      case 'in-progress':
        return 'bg-yellow-500/10 text-yellow-500'
      default:
        return 'bg-slate-500/10 text-slate-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-500/10 text-blue-500'
      case 'quiz':
        return 'bg-purple-500/10 text-purple-500'
      case 'project':
        return 'bg-pink-500/10 text-pink-500'
      case 'meeting':
        return 'bg-orange-500/10 text-orange-500'
      default:
        return 'bg-slate-500/10 text-slate-500'
    }
  }

  return (
    <Card>
      <CardHeader>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            event: (date) => getEventsForDate(date).length > 0
          }}
          modifiersStyles={{
            event: { fontWeight: 'bold' }
          }}
        />

        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
          </h3>
          <div className="space-y-2">
            {selectedDateEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-2">
                No events scheduled
              </p>
            ) : (
              selectedDateEvents.map(event => (
                <div
                  key={event.id}
                  className="p-3 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="secondary" className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className={getTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    {event.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.duration}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{selectedEvent?.date && format(selectedEvent.date, 'MMMM d, yyyy')}</span>
            </div>
            {selectedEvent?.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{selectedEvent.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={selectedEvent && getTypeColor(selectedEvent.type)}>
                {selectedEvent?.type}
              </Badge>
              <Badge variant="outline" className={selectedEvent && getStatusColor(selectedEvent.status)}>
                {selectedEvent?.status}
              </Badge>
            </div>
            {selectedEvent?.description && (
              <p className="text-muted-foreground">
                {selectedEvent.description}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}