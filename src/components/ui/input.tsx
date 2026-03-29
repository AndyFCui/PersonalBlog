/**
 * [INPUT]: className, type, placeholder, disabled
 * [OUTPUT]: Neumorphism inset input with pressed effect
 * [POS]: components/ui - Form input primitive
 */
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl px-4 py-2 text-sm",
        "bg-secondary",
        "shadow-[inset_4px_4px_8px_color-mix(in_srgb,var(--secondary)_30%,black),inset_-2px_-2px_6px_rgba(255,255,255,0.04)]",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:shadow-[inset_4px_4px_8px_color-mix(in_srgb,var(--secondary)_40%,black),inset_-2px_-2px_6px_rgba(255,255,255,0.06)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Input }
