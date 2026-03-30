/**
 * Scroll Area Component
 * Provides a scrollable container with custom scrollbar styling
 */
import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function ScrollArea({ children, className, ...props }: ScrollAreaProps) {
  return (
    <div
      data-slot="scroll-area"
      className={cn(
        "relative overflow-auto",
        "[&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar]:h-2",
        "[&::-webkit-scrollbar]:rounded-full",
        "[&::-webkit-scrollbar::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar::-webkit-scrollbar-thumb]:bg-border rounded-full",
        "[&::-webkit-scrollbar::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { ScrollArea }
