import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-none border-2 border-foreground bg-background px-3.5 py-2 text-sm transition-colors duration-100 outline-none selection:bg-foreground selection:text-background file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground placeholder:italic disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:border-b-4 focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

export { Input }
