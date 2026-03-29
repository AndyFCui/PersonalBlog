import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import type { ResumeData } from '@/types/resume'

interface ExperienceProps {
  data: ResumeData | null
}

export function Experience({ data }: ExperienceProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data?.work) return null

  return (
    <section id="experience" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work <span className="text-primary">Experience</span>
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

          <div className="space-y-8">
            {data.work.map((work, index) => (
              <motion.div
                key={work.company}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />

                {/* Content card */}
                <div className="flex-1 ml-16 md:ml-0">
                  <Card
                    className="hover:shadow-glass transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-16 h-16 border-2 border-primary/20">
                          <AvatarImage
                            src={`/images/${work.image}`}
                            alt={work.company}
                            loading="lazy"
                          />
                          <AvatarFallback>{work.company.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{work.title}</h3>
                          <p className="text-primary font-medium">{work.company}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-foreground/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {work.years}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expandable description */}
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-border/50">
                              <ul className="space-y-2">
                                {work.description.map((desc, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-foreground/80 leading-relaxed"
                                  >
                                    {desc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {hoveredIndex !== index && (
                        <motion.p
                          initial={{ opacity: 0.6 }}
                          animate={{ opacity: 0.6 }}
                          className="text-sm text-foreground/50 italic"
                        >
                          Hover to view details...
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
