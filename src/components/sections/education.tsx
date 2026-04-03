import { motion } from 'framer-motion'
import { Calendar, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { ResumeData } from '@/types/resume'

interface EducationProps {
  data: ResumeData | null
}

export function Education({ data }: EducationProps) {
  if (!data?.education) return null

  return (
    <section id="education" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Education
        </motion.h2>

        <div className="space-y-6">
          {data.education.map((edu, index) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-glass transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarImage
                        src={edu.image.startsWith('http') ? edu.image : `/images/${edu.image}`}
                        alt={edu.school}
                        loading="lazy"
                      />
                      <AvatarFallback>{edu.school.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-primary font-medium">{edu.school}</p>
                      <div className="flex items-center gap-1 mt-1 text-sm text-foreground/60">
                        <Calendar className="w-4 h-4" />
                        {edu.graduated}
                      </div>
                    </div>
                  </div>

                  {/* Honors/Awards */}
                  {edu.honor && (
                    <div className="mb-4 p-3 rounded-neumorphic bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="font-medium text-primary">{edu.awards}</span>
                      </div>
                      <p className="text-sm text-foreground/80 mt-1">{edu.honor}</p>
                    </div>
                  )}

                  {/* Coursework */}
                  {edu.Coursework && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground/60 mb-2">
                        Relevant Coursework:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.Coursework.split(',').map((course) => (
                          <Badge key={course.trim()} variant="secondary">
                            {course.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
