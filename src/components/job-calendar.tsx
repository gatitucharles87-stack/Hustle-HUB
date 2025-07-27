"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { format } from "date-fns"

type CalendarEvent = {
  title: string
  date: Date
  employer: string
}

type JobCalendarProps = {
  events: CalendarEvent[]
}

export function JobCalendar({ events }: JobCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const selectedEvents = events.filter(e => date && e.date.toDateString() === date.toDateString());

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border self-start"
            modifiers={{
                events: events.map(e => e.date)
            }}
            modifiersClassNames={{
                events: "bg-primary text-primary-foreground"
            }}
        />
        <div className="space-y-2">
            <h4 className="font-semibold text-lg">
                Gigs for: <span className="text-primary">{date ? format(date, "PPP") : "No date selected"}</span>
            </h4>
            <div className="space-y-4">
                {selectedEvents.length > 0 ? (
                    selectedEvents.map((event, index) => (
                         <Card key={index} className="border-l-4 border-primary">
                            <CardHeader className="p-4">
                                <CardTitle className="text-base">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>Employer: {event.employer}</span>
                                </div>
                            </CardContent>
                         </Card>
                    ))
                ) : (
                    <div className="text-center py-8 px-4 bg-muted/50 rounded-lg h-full flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No gigs scheduled for this day.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}
