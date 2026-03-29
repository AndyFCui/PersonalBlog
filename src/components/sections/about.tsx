import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { MainData } from '@/types/resume'

interface AboutProps {
  data: MainData | null
}

export function About({ data }: AboutProps) {
  if (!data) return null

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          About <span className="text-primary">Me</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column - Avatar and contact */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-xl opacity-30" />
              <Avatar className="w-48 h-48 border-4 border-primary/20 shadow-glass">
                <AvatarImage
                  src={`/images/${data.image}`}
                  alt={data.name}
                  loading="lazy"
                />
                <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <h3 className="text-2xl font-semibold mb-2">{data.nameUnderImage}</h3>
            <p className="text-foreground/60 mb-2">{data.city}, {data.address.state}</p>
            {data.intro && (
              <div className="text-center">
                <p className="text-primary font-medium">{data.intro.role}</p>
                <p className="text-sm text-foreground/60">{data.intro.company}</p>
              </div>
            )}

            {/* Contact info */}
            <div className="w-full space-y-3 mb-6">
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-3 p-3 rounded-neumorphic bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-sm">{data.email}</span>
              </a>
              <a
                href={`tel:${data.phone}`}
                className="flex items-center gap-3 p-3 rounded-neumorphic bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-sm">{data.phone}</span>
              </a>
              <div className="flex items-center gap-3 p-3 rounded-neumorphic bg-secondary">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-sm">{data.address.city}, {data.address.state}</span>
              </div>
            </div>

            <Button variant="default" size="lg" asChild>
              <a href={`/images/CUIXIANGYU.pdf`} download>
                <Download className="h-5 w-5" />
                Download CV
              </a>
            </Button>
          </motion.div>

          {/* Right column - Bio and skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Biography</h3>
              <p className="text-foreground/80 leading-relaxed">{data.bio}</p>
            </div>

            {/* Tech stack */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
              <div className="space-y-6">
                {data.skills.map((category) => (
                  <div key={category.category}>
                    <h4 className="text-sm font-medium text-foreground/60 mb-3">
                      {category.category}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {category.items.map((item) => (
                        <Badge key={item.name} variant="secondary" className="px-3 py-1.5">
                          <img
                            src={`/${item.image}`}
                            alt={item.name}
                            className="w-5 h-5 mr-2"
                            loading="lazy"
                          />
                          {item.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
