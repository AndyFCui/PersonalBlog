import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useThemeStore } from '@/lib/theme'

const navItems = [
  { label: 'Blog', href: '/blog' },
  { label: 'Tag', href: '/blog/tags' },
  { label: 'Category', href: '/blog/categories' },
  { label: 'Timeline', href: '/blog/timeline' },
]

export function BlogHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useThemeStore()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="w-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary dark:text-primary'
                      : 'text-black/80 dark:text-white/80 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5 dark:text-white" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link to="/admin/login" className="ml-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <img
                src="/icons/icons8-backend-development-48.png"
                alt="Admin"
                className="w-8 h-8 rounded-full hover:ring-2 hover:ring-primary transition-all"
                onMouseEnter={(e) => (e.currentTarget as HTMLImageElement).src = '/icons/icons8-backend-development-48.gif'}
                onMouseLeave={(e) => (e.currentTarget as HTMLImageElement).src = '/icons/icons8-backend-development-48.png'}
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5 dark:text-white" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-background/95 backdrop-blur-md"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block w-full text-left py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
