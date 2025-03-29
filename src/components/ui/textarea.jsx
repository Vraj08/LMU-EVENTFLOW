import React from "react";

export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";