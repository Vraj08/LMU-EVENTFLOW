import React, { useState } from "react"
import * as Popover from "@radix-ui/react-popover"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"

export default function Calendar({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleSelect = (date) => {
    onSelect(date)
    setOpen(false)
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 w-full sm:w-72 px-4 py-2 bg-gradient-to-br from-[#dfe9f3] via-[#f8f9fa] to-[#e2f0fb] text-gray-900 text-sm font-medium border border-blue-100 rounded-xl shadow-md hover:shadow-lg transition">
          <span className="text-xl">📅</span>
          {selected ? format(selected, "MMMM do, yyyy") : "Pick a date"}
        </button>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        className="z-50 mt-2 rounded-md border bg-white p-4 shadow-md w-[300px]"
      >
        <Header currentMonth={currentMonth} onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))} onNext={() => setCurrentMonth(addMonths(currentMonth, 1))} />
        <Days />
        <Dates
          currentMonth={currentMonth}
          selected={selected}
          onSelect={handleSelect}
        />
      </Popover.Content>
    </Popover.Root>
  )
}

const Header = ({ currentMonth, onPrev, onNext }) => (
  <div className="flex justify-between items-center mb-2">
    <button onClick={onPrev} className="p-1 rounded hover:bg-gray-200">
      <ChevronLeft className="w-4 h-4" />
    </button>
    <span className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</span>
    <button onClick={onNext} className="p-1 rounded hover:bg-gray-200">
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
)

const Days = () => {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  return (
    <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-1">
      {days.map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>
  )
}

const Dates = ({ currentMonth, selected, onSelect }) => {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const rows = []
  let days = []
  let day = startDate

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day
      const isToday = isSameDay(day, new Date())
const isSelected = selected && isSameDay(day, selected)
const isOutsideMonth = !isSameMonth(day, monthStart)
const isPast = day < new Date().setHours(0, 0, 0, 0)

days.push(
  <button
    key={day}
    onClick={() => !isPast && onSelect(cloneDay)}
    disabled={isPast}
    className={`w-10 h-10 text-sm rounded-md transition ${
      isSelected
        ? "bg-indigo-600 text-white"
        : isPast
        ? "text-gray-300 cursor-not-allowed"
        : isToday
        ? "border border-indigo-500 text-indigo-600"
        : isOutsideMonth
        ? "text-gray-300"
        : "hover:bg-gray-200"
    }`}
  >
    {format(day, "d")}
  </button>
)

      day = addDays(day, 1)
    }
    rows.push(
      <div key={day} className="grid grid-cols-7 gap-1 mb-1">
        {days}
      </div>
    )
    days = []
  }

  return <div>{rows}</div>
}
