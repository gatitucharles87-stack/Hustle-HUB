"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type CalendarEvent = {
  title: string
  date: Date
}

type JobCalendarProps = {
  events: CalendarEvent[]
}

export function JobCalendar({ events }: JobCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const eventDates = events.map(event => event.date.toDateString());

  return (
     <div className="space-y-4">
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
                events: events.map(e => e.date)
            }}
            modifiersClassNames={{
                events: "bg-primary text-primary-foreground"
            }}
        />
        <div className="space-y-2">
            <h4 className="font-semibold">Selected Date Gigs:</h4>
            <div className="space-y-2">
                {events.filter(e => e.date.toDateString() === date?.toDateString()).length > 0 ? (
                    events.filter(e => e.date.toDateString() === date?.toDateString()).map((event, index) => (
                         <Card key={index} className="p-3">
                            <p className="font-semibold">{event.title}</p>
                         </Card>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No gigs scheduled for this day.</p>
                )}
            </div>
        </div>
    </div>
  )
}
