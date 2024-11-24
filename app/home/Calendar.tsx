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

  // Sample backend data (replace with actual API data)
  const sampleEvents: Event[] = [
    { date: "2024-11-05", description: "Holiday" },
    { date: "2024-11-12", description: "Leave" },
    { date: "2024-11-20", description: "Meeting" },
    { date: "2024-11-25", description: "Conference" },
  ];

  // Update the events state to show only the events in the current month
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

  // Toggle the event view when a date is clicked
  const handleDateClick = (day: Date) => {
    if (selectedDate && isSameDay(day, selectedDate)) {
      setSelectedDate(null); // Deselect the date if it's already selected
    } else {
      setSelectedDate(day); // Select the new date
    }
  };

  // Get the events for the selected date
  const selectedDayEvents = selectedDate
    ? events.filter((event) => isSameDay(parseISO(event.date), selectedDate))
    : [];

  return (
    <div className="flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 w-full max-w-screen-lg mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Previous
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          Next
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 w-full mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-center font-medium text-gray-600 bg-gray-100 rounded-md"
          >
            {day}
          </div>
        ))}
        {daysInMonth.map((day) => {
          const hasEvent = events.some((event) =>
            isSameDay(parseISO(event.date), day)
          );
          const dayEvents = events.filter((event) =>
            isSameDay(parseISO(event.date), day)
          );
          return (
            <div
              key={day.toISOString()}
              className={clsx(
                "group relative flex flex-col items-center justify-center h-20 border border-gray-200 rounded-md cursor-pointer",
                hasEvent ? "bg-yellow-100" : "bg-white hover:bg-gray-50"
              )}
              onClick={() => handleDateClick(day)}
            >
              <span className="text-sm text-gray-800">{format(day, "d")}</span>
              {/* Add Dot Indicator for Events */}
              {hasEvent && (
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
              )}
              {/* Hover Tooltip for Events */}
              {hasEvent && (
                <div className="absolute hidden group-hover:block bottom-12 left-1/2 transition-all transform -translate-x-1/2 p-2 bg-white border border-gray-200 rounded-md shadow-lg text-gray-800 text-xs">
                  <ul className="space-y-1">
                    {dayEvents.map((event, index) => (
                      <li key={index}>
                        <strong>{event.description}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Events List for the selected day */}
      {selectedDate && selectedDayEvents.length > 0 && (
        <div className="w-full mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Events for {format(selectedDate, "MMM d, yyyy")}:
          </h3>
          <ul className="space-y-2">
            {selectedDayEvents.map((event, index) => (
              <li
                key={index}
                className="p-4 border rounded-md bg-gray-50 text-gray-800"
              >
                <strong>{format(parseISO(event.date), "MMM d, yyyy")}: </strong>
                {event.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
