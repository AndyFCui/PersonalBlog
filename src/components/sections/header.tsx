import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon, Download, ChevronDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeStore } from '@/lib/theme'
import { socialIcons, socialColors } from '@/lib/social'
import type { MainData } from '@/types/resume'
import backendDevGif from '@/icons/icons8-backend-development-48.gif'

interface HeaderProps {
  data: MainData | null
}

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()'

export function Header({ data }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const { theme, toggleTheme } = useThemeStore()

  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      initialX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      initialY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      targetX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      targetY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      duration: Math.random() * 10 + 10,
    }))
  }, [])

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

  const linksLinks = [
    { label: '雪山飞狐Snow Fox Club', description: '华人滑雪俱乐部', href: 'https://www.snowfox.life' },
  ]

  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/header-background.webp)' }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-primary/20" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: particle.initialX,
              y: particle.initialY,
            }}
            animate={{
              x: particle.targetX,
              y: particle.targetY,
            }}
            transition={{
              duration: particle.duration,
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
                <DropdownMenuContent className="rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-lg p-2 min-w-[160px]">
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

              <Link
                to="/blog"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Blog
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer">
                  Links
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-lg p-2 min-w-[200px]">
                  {linksLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.label}
                      render={<a href={link.href} target="_blank" rel="noopener noreferrer" className="w-full px-3 py-2 rounded-lg hover:bg-secondary/80 cursor-pointer transition-colors" />}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm">{link.label}</span>
                        <span className="text-xs text-muted-foreground">{link.description}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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
              <Link
                to="/blog"
                className="block w-full text-left py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="py-2">
                <p className="text-sm font-medium text-foreground/50 mb-2">Links</p>
                <div className="pl-4 space-y-2">
                  {linksLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div>
                        <span>{link.label}</span>
                        <span className="block text-xs text-muted-foreground">{link.description}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
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
                aria-label={social.name}
                className="p-3 rounded-full bg-secondary shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-200"
              >
                <IconComponent className="h-6 w-6" style={{ color: iconColor }} />
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
