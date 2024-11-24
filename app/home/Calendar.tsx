"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import clsx from "clsx";

type Event = {
  date: string; // Date string in "yyyy-MM-dd" format
  description: string;
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const sampleEvents: Event[] = [
    { date: "2024-11-05", description: "Holiday" },
    { date: "2024-11-12", description: "Leave" },
    { date: "2024-11-20", description: "Meeting" },
    { date: "2024-11-25", description: "Conference" },
  ];

  useEffect(() => {
    const filteredEvents = sampleEvents.filter((event) => {
      const eventDate = parseISO(event.date);
      return (
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
    setEvents(filteredEvents);
  }, [currentMonth]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    setSelectedDate((prevDate) =>
      prevDate && isSameDay(day, prevDate) ? null : day
    );
  };

  const selectedDayEvents = selectedDate
    ? events.filter((event) => isSameDay(parseISO(event.date), selectedDate))
    : [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-gray-600 font-medium py-1">
            {day}
          </div>
        ))}
        {daysInMonth.map((day) => {
          const hasEvent = events.some((event) =>
            isSameDay(parseISO(event.date), day)
          );
          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={clsx(
                "h-20 flex items-center justify-center border rounded-md cursor-pointer",
                hasEvent ? "bg-blue-100" : "bg-gray-100",
                selectedDate && isSameDay(day, selectedDate)
                  ? "ring-2 ring-blue-500"
                  : "hover:bg-gray-200"
              )}
            >
              <span>{format(day, "d")}</span>
            </div>
          );
        })}
      </div>

      {/* Selected Day Events */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold">
            Events for {format(selectedDate, "MMMM d, yyyy")}:
          </h3>
          {selectedDayEvents.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {selectedDayEvents.map((event, index) => (
                <li
                  key={index}
                  className="p-3 bg-white shadow rounded-md border"
                >
                  {event.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-600">No events for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}
