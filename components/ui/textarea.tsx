import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl px-4 py-3 text-base transition-all outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm glass resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
