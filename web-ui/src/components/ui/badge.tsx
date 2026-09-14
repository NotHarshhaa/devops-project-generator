import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-none border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest font-medium whitespace-nowrap transition-colors duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-foreground text-background",
        secondary:
          "border-foreground/40 bg-muted text-foreground",
        destructive:
          "border-foreground bg-foreground text-background",
        outline:
          "border-foreground bg-transparent text-foreground",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-muted",
        link: "border-transparent text-foreground underline underline-offset-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
