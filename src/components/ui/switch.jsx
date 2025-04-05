import React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

export const Switch = React.forwardRef(({ className = "", ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-gray-300 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 data-[state=checked]:bg-indigo-600 ${className}`}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className="block h-5 w-5 rounded-full bg-white shadow transform transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
    />
  </SwitchPrimitive.Root>
))
