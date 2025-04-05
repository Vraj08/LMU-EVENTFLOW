import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

export const DialogContent = React.forwardRef(
  ({ children, className = "", ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity" />
      <DialogPrimitive.Content
        ref={ref}
        className={`fixed z-50 left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg outline-none animate-in fade-in-90 ${className}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 text-gray-500 transition hover:text-gray-900">
          <X className="h-5 w-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
)
DialogContent.displayName = "DialogContent"

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
)

export const DialogFooter = ({ children }) => (
  <div className="mt-6 flex justify-end gap-2">{children}</div>
)

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-800">{children}</h2>
)
