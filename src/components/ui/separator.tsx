/**
 * Separator Component
 * Provides a horizontal or vertical divider
 */
import * as React from "react"
import { cn } from "@/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical"
}

function Separator({
  children,
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  const isVertical = orientation === "vertical"

  return (
    <hr
      data-slot="separator"
      data-orientation={orientation}
      className={cn(
        "shrink-0 border-border/50",
        isVertical ? "h-full w-px" : "h-px w-full border-0 bg-border",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
