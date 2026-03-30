/**
 * Navigation Menu Component
 * Provides navigation menu functionality with dropdown content
 */
import * as React from "react"
import { Dialog as PopoverPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"

interface NavigationMenuContextValue {
  activeItem: string | null
  setActiveItem: (value: string | null) => void
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | null>(null)

function useNavigationMenuContext() {
  const context = React.useContext(NavigationMenuContext)
  if (!context) {
    throw new Error("NavigationMenu components must be used within a NavigationMenu")
  }
  return context
}

function NavigationMenu({ children, defaultValue, ...props }: PopoverPrimitive.Root.Props & { defaultValue?: string }) {
  const [activeItem, setActiveItem] = React.useState<string | null>(defaultValue ?? null)

  return (
    <NavigationMenuContext.Provider value={{ activeItem, setActiveItem }}>
      <PopoverPrimitive.Root data-slot="navigation-menu" {...props}>
        {children}
      </PopoverPrimitive.Root>
    </NavigationMenuContext.Provider>
  )
}

function NavigationMenuTrigger({ children, ...props }: PopoverPrimitive.Trigger.Props) {
  return (
    <PopoverPrimitive.Trigger data-slot="navigation-menu-trigger" {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  )
}

function NavigationMenuContent({ children, ...props }: PopoverPrimitive.Backdrop.Props) {
  return (
    <PopoverPrimitive.Backdrop
      data-slot="navigation-menu-content"
      className={cn(
        "absolute top-full z-50 mt-2 min-w-[200px] rounded-xl border border-border/50 bg-card p-2 shadow-lg",
        "data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Backdrop>
  ) as React.ReactElement
}

// Add missing className type
NavigationMenuContent.defaultProps = {
  className: "",
}

function NavigationMenuLink({
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      data-slot="navigation-menu-link"
      className={cn(
        "block select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

function NavigationMenuList({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-list"
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function NavigationMenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  NavigationMenu,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
}
