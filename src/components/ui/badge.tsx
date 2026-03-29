import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ========================================
   Neumorphism Design Tokens
   ======================================== */

const NEUMORPHISM = {
  default: {
    bg: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 80%, black) 100%)',
    shadow: '0 2px 6px color-mix(in srgb, var(--primary) 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)',
    hoverShadow: '0 3px 10px color-mix(in srgb, var(--primary) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
  },
  secondary: {
    bg: 'linear-gradient(135deg, var(--secondary) 0%, color-mix(in srgb, var(--secondary) 90%, black) 100%)',
    shadow: '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
    hoverShadow: '0 3px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)',
  },
  destructive: {
    bg: 'linear-gradient(135deg, var(--destructive) 0%, color-mix(in srgb, var(--destructive) 80%, black) 100%)',
    shadow: '0 2px 6px color-mix(in srgb, var(--destructive) 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)',
    hoverShadow: '0 3px 10px color-mix(in srgb, var(--destructive) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
  },
  accent: {
    bg: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 85%, black) 100%)',
    shadow: '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
    hoverShadow: '0 3px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
  },
}

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
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
  render,
  style,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  const [isHovered, setIsHovered] = React.useState(false)

  const needsNeumorphism = variant && ['default', 'secondary', 'destructive', 'accent'].includes(variant)
  const styleConfig = needsNeumorphism ? NEUMORPHISM[variant as keyof typeof NEUMORPHISM] : null

  const combinedStyle = needsNeumorphism && styleConfig ? {
    background: styleConfig.bg,
    boxShadow: isHovered ? styleConfig.hoverShadow : styleConfig.shadow,
    ...style,
  } : style

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
    style: combinedStyle,
    onMouseEnter: (e: React.MouseEvent<HTMLSpanElement>) => {
      setIsHovered(true)
      props.onMouseEnter?.(e)
    },
    onMouseLeave: (e: React.MouseEvent<HTMLSpanElement>) => {
      setIsHovered(false)
      props.onMouseLeave?.(e)
    },
  })
}

export { Badge, badgeVariants }
