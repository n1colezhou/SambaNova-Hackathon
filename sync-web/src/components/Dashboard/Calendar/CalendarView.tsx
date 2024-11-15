import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import type { TimeBlock, TimelineItem } from "../index";

interface CalendarViewProps {
  blocks: TimeBlock[];
}

export function CalendarView({ blocks }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedEvent, setSelectedEvent] = useState<TimelineItem | null>(null);

  const allEvents = blocks.flatMap((block) => block.items);

  const getEventsForDate = (date: Date) => {
    return allEvents.filter(
      (event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-500";
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "task":
        return "bg-blue-500/10 text-blue-500";
      case "quiz":
        return "bg-purple-500/10 text-purple-500";
      case "project":
        return "bg-pink-500/10 text-pink-500";
      case "meeting":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-center items-center mt-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              modifiers={{
                event: (date) => getEventsForDate(date).length > 0,
              }}
              modifiersStyles={{
                event: { fontWeight: "bold" },
              }}
              classNames={{
                caption:
                  "flex justify-center pt-1 relative items-center w-full",
                caption_label: "text-sm font-medium",
                nav: "flex items-center",
                nav_button:
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex w-full",
                head_cell: "w-9 font-normal text-muted-foreground rounded-md",
                row: "flex w-full mt-2",
                cell: "w-9 h-9 text-center text-sm relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 p-0",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                day_range_end: "day-range-end",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "opacity-50",
                day_disabled: "opacity-50 cursor-not-allowed",
                day_hidden: "invisible",
              }}
            />
          </div>

          <div className="w-full px-4 pb-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">
              {selectedDate
                ? format(selectedDate, "MMMM d, yyyy")
                : "Selected Date"}
            </h3>
            <div className="space-y-2">
              {selectedDateEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-2">
                  No events scheduled
                </p>
              ) : (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(event.status)}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge
                        variant="outline"
                        className={getTypeColor(event.type)}
                      >
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
        </div>

        <Dialog
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {selectedEvent?.date &&
                    format(new Date(selectedEvent.date), "MMMM d, yyyy")}
                </span>
              </div>
              {selectedEvent?.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedEvent.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={selectedEvent && getTypeColor(selectedEvent.type)}
                >
                  {selectedEvent?.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    selectedEvent && getStatusColor(selectedEvent.status)
                  }
                >
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
      </CardContent>
    </Card>
  );
}
