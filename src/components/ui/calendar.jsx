"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

import { cn } from "../../utils/cn"
import { buttonVariants } from "./Button";

export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        caption: "flex justify-between items-center",
        caption_label: "text-sm font-medium text-center w-full",
        nav: "flex items-center gap-2",
        nav_button: "h-7 w-7 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "",
        head_cell: "text-gray-400 text-xs text-center font-medium",
        row: "flex justify-between",
        cell: "text-center text-sm w-9 h-9 rounded hover:bg-gray-100 cursor-pointer",
        day: "h-9 w-9 flex items-center justify-center",
        day_selected: "bg-black text-white",
        day_today: "text-blue-600 font-semibold",
        day_outside: "text-gray-300",
        day_disabled: "text-gray-300 opacity-50",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
