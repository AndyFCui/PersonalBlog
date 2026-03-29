/**
 * [INPUT]: className, size, variant (elevated/inset)
 * [OUTPUT]: Neumorphism styled card with gradient and 3D shadow
 * [POS]: components/ui - Content container primitive
 */
import * as React from "react"
import { cn } from "@/lib/utils"

/* ========================================
   Neumorphism Design Tokens
   ======================================== */

/* ========================================
   Neumorphism Design Tokens
   ======================================== */

const NEUMORPHISM = {
  elevated: {
    bg: 'linear-gradient(145deg, color-mix(in srgb, var(--secondary) 100%, white 8%) 0%, var(--secondary) 50%, color-mix(in srgb, var(--secondary) 90%, black 15%) 100%)',
    shadow: '8px 8px 20px rgba(0,0,0,0.35), -4px -4px 12px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
    hoverShadow: '10px 10px 24px rgba(0,0,0,0.4), -6px -6px 16px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  inset: {
    bg: 'linear-gradient(145deg, color-mix(in srgb, var(--secondary) 90%, black 10%) 0%, color-mix(in srgb, var(--secondary) 100%, white 5%) 100%)',
    shadow: 'inset 4px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 6px rgba(255,255,255,0.04)',
    hoverShadow: 'inset 6px 6px 12px rgba(0,0,0,0.35), inset -3px -3px 8px rgba(255,255,255,0.06)',
  },
  primary: {
    bg: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 85%, black) 50%, color-mix(in srgb, var(--primary) 70%, black) 100%)',
    shadow: '0 6px 24px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.1)',
    hoverShadow: '0 10px 32px color-mix(in srgb, var(--primary) 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.15)',
  },
}

interface CardProps extends React.ComponentProps<"div"> {
  variant?: 'elevated' | 'inset' | 'primary'
  size?: 'default' | 'sm'
}

function Card({
  className,
  variant = 'elevated',
  size = 'default',
  ...props
}: CardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const styleConfig = NEUMORPHISM[variant]

  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-2xl py-4 text-sm text-card-foreground transition-all duration-200",
        "has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
        "data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
        "*:[img:first-child]:rounded-t-2xl *:[img:last-child]:rounded-b-2xl",
        className
      )}
      style={{
        background: styleConfig.bg,
        boxShadow: isHovered ? styleConfig.hoverShadow : styleConfig.shadow,
        ...props.style,
      }}
      onMouseEnter={(e) => { setIsHovered(true); props.onMouseEnter?.(e) }}
      onMouseLeave={(e) => { setIsHovered(false); props.onMouseLeave?.(e) }}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-2xl px-5 py-4",
        "group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "[.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-lg leading-snug font-semibold tracking-tight",
        "group-data-[size=sm]/card:text-base",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 group-data-[size=sm]/card:px-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-2xl border-t border-border/50 bg-muted/30 p-4 mt-auto",
        "group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
