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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          About <span className="text-primary">Me</span>
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left column - Avatar and contact */}
          <motion.div
            className="flex flex-col items-center lg:items-start"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Avatar with glow effect */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-accent rounded-full blur-3xl opacity-40 animate-pulse" />
              <div className="relative">
                <Avatar className="w-56 h-56 border-4 border-primary/30 shadow-2xl">
                  <AvatarImage
                    src={data.image.startsWith('http') ? data.image : `/images/${data.image}`}
                    alt={data.name}
                    loading="lazy"
                  />
                  <AvatarFallback className="text-3xl">{data.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent" />
              </div>
            </div>

            {/* Name and role */}
            <motion.h3
              className="text-3xl font-bold mb-2 text-center lg:text-left"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {data.nameUnderImage}
            </motion.h3>
            <motion.p
              className="text-lg text-foreground/70 mb-4 text-center lg:text-left"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {data.city}, {data.address.state}
            </motion.p>

            {data.intro && (
              <motion.div
                className="text-center lg:text-left mb-8"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="text-xl text-primary font-semibold">{data.intro.role}</p>
                <p className="text-sm text-foreground/60">{data.intro.company}</p>
              </motion.div>
            )}

            {/* Contact info cards */}
            <motion.div
              className="w-full space-y-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { icon: Mail, label: data.email, href: `mailto:${data.email}` },
                { icon: Phone, label: data.phone, href: `tel:${data.phone}` },
                { icon: MapPin, label: `${data.address.city}, ${data.address.state}`, href: null },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-secondary/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/50">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="default" size="xl" className="shadow-lg shadow-primary/20" asChild>
                <a href={`/images/CUIXIANGYU.pdf`} download>
                  <Download className="h-5 w-5" />
                  Download CV
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column - Bio */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Biography */}
            <motion.div
              className="p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <span className="w-8 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                Biography
              </h3>
              <p className="text-base leading-relaxed text-foreground/90">{data.bio}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
