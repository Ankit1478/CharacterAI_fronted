import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-4 py-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", // Increased min-height, padding, and font-size
        className
      )}
      ref={ref}
      {...props}
    />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
