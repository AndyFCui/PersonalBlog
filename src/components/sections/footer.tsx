import { motion } from 'framer-motion'
import { Heart, Linkedin, Github, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { MainData } from '@/types/resume'

const socialIcons: Record<string, { icon: typeof Linkedin; color: string; label: string }> = {
  linkedin: { icon: Linkedin, color: '#0A66C2', label: 'LinkedIn' },
  github: { icon: Github, color: '#333333', label: 'GitHub' },
}

const socialColors: Record<string, string> = {
  linkedin: '#0A66C2',
  github: '#333333',
}

interface FooterProps {
  data: MainData | null
}

export function Footer({ data }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contact" className="py-12 px-4 bg-secondary/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-foreground/60 max-w-md mx-auto mb-6">
            {data?.contactmessage || "Let's connect and build something amazing together."}
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <Button variant="default" size="lg" asChild>
              <a href={`mailto:${data?.email || 'xiangyucui@outlook.com'}`}>
                Email Me
              </a>
            </Button>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4 mb-8">
            {data?.social.map((social) => {
              const IconComponent = socialIcons[social.name]?.icon || ExternalLink
              const iconColor = socialColors[social.name] || 'currentColor'
              const label = socialIcons[social.name]?.label || social.name

              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-200 flex items-center gap-2 px-4"
                >
                  <IconComponent className="h-5 w-5" style={{ color: iconColor }} />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          className="text-center text-sm text-foreground/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> by {data?.name || 'Andy Cui'}
          </p>
          <p className="mt-1">
            © {currentYear} All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
