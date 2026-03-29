import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon, Download, Linkedin, Github, ExternalLink, ChevronDown, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore } from '@/lib/theme'
import type { MainData } from '@/types/resume'

interface HeaderProps {
  data: MainData | null
}

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()'

const socialIcons: Record<string, { icon: typeof Linkedin; color: string }> = {
  linkedin: { icon: Linkedin, color: '#0A66C2' },
  github: { icon: Github, color: '#333333' },
}

const socialColors: Record<string, string> = {
  linkedin: '#0A66C2',
  github: '#333333',
}

export function Header({ data }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!data?.name) return

    let index = 0
    const interval = setInterval(() => {
      if (index <= data.name.length) {
        const glitchChar = matrixChars[Math.floor(Math.random() * matrixChars.length)]
        setDisplayedText(data.name.slice(0, index) + glitchChar)
        index++
      } else {
        setDisplayedText(data.name)
        clearInterval(interval)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [data?.name])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const infoLinks = [
    { href: '#experience', label: 'Experience' },
    { href: '#education', label: 'Education' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/header-background.jpg)' }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-primary/20" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
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
              <button
                onClick={scrollToTop}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Home
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer">
                  Info
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-xl bg-card border border-border/50 shadow-lg p-2 min-w-[160px]">
                  {infoLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.href}
                      render={<a href={link.href} className="w-full px-3 py-2 text-sm rounded-lg hover:bg-secondary/80 cursor-pointer transition-colors" />}
                    >
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
              >
                Blog
              </button>

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
              <button
                onClick={() => { scrollToTop(); setIsMobileMenuOpen(false) }}
                className="block w-full text-left py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Home
              </button>
              <div className="py-2">
                <p className="text-sm font-medium text-foreground/50 mb-2">Info</p>
                <div className="pl-4 space-y-2">
                  {infoLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <button
                className="block w-full text-left py-2 text-sm font-medium text-foreground/50 cursor-not-allowed"
              >
                Blog (Coming Soon)
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero content */}
      <div className="relative z-20 text-center px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {displayedText || 'Loading...'}
        </motion.h1>

        {data?.occupation && (
          <motion.p
            className="text-lg md:text-xl text-foreground/60 mt-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {data.occupation}
          </motion.p>
        )}

        {data?.description && (
          <motion.p
            className="text-sm text-primary/80 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {data.description}
          </motion.p>
        )}

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button variant="default" size="lg" asChild>
            <a href={data?.resumedownload || '#'} download>
              <Download className="h-5 w-5" />
              Download Resume
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#contact">Get in Touch</a>
          </Button>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-12 flex justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {data?.social.map((social) => {
            const IconComponent = socialIcons[social.name]?.icon || ExternalLink
            const iconColor = socialColors[social.name] || 'currentColor'

            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-200"
              >
                <IconComponent className="h-6 w-6" style={{ color: iconColor }} />
                <span className="sr-only">{social.name}</span>
              </a>
            )
          })}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </header>
  )
}
