import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { PortfolioData, PortfolioProject } from '@/types/resume'

interface PortfolioProps {
  data: PortfolioData | null
}

export function Portfolio({ data }: PortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)

  if (!data?.projects) return null

  return (
    <section id="portfolio" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Featured <span className="text-primary">Projects</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="group relative rounded-neumorphic bg-card overflow-hidden shadow-neumorphic hover:shadow-glass transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Project image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`/images/portfolio/${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex gap-2">
                    <Button size="icon" variant="secondary" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="icon" variant="secondary" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-primary">{project.category}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Project Modal */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl">
            <DialogTitle className="sr-only">{selectedProject?.title}</DialogTitle>
            {selectedProject && (
              <div>
                <div className="relative mb-4 rounded-lg overflow-hidden">
                  <img
                    src={`/images/portfolio/${selectedProject.image}`}
                    alt={selectedProject.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{selectedProject.title}</h3>
                <p className="text-primary mb-4">{selectedProject.category}</p>
                <div className="space-y-2 mb-6">
                  {selectedProject.description.map((desc, i) => (
                    <p key={i} className="text-foreground/80 leading-relaxed">
                      {desc}
                    </p>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button asChild>
                    <a href={selectedProject.url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                      View on GitHub
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedProject(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
