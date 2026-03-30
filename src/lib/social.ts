import { Linkedin, Github, ExternalLink } from 'lucide-react'

export const socialIcons: Record<string, { icon: typeof Linkedin; color: string; label: string }> = {
  linkedin: { icon: Linkedin, color: '#0A66C2', label: 'LinkedIn' },
  github: { icon: Github, color: '#333333', label: 'GitHub' },
  default: { icon: ExternalLink, color: 'currentColor', label: 'Link' },
}

export const socialColors: Record<string, string> = {
  linkedin: '#0A66C2',
  github: '#333333',
}
