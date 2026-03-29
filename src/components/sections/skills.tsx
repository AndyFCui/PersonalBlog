import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import type { ResumeData } from '@/types/resume'

interface SkillsProps {
  data: ResumeData | null
}

export function Skills({ data }: SkillsProps) {
  if (!data?.skills) return null

  // Group skills into categories for display
  const categories = [
    { name: 'Languages', skills: ['Java', 'Python', 'JavaScript', 'C/C++', 'Assembly', 'VB'] },
    { name: 'Frontend', skills: ['HTML', 'CSS', 'React.js', 'jQuery', 'Node.js'] },
    { name: 'Backend', skills: ['Spring Boot', 'Servlet', 'JUnit'] },
    { name: 'Database', skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite'] },
    { name: 'AI/ML', skills: ['TF-IDF', 'Naive Bayes', 'GPT-2', 'Bert', 'CNN', 'Transform'] },
    { name: 'DevOps', skills: ['AWS', 'Docker', 'GitHub', 'Jenkins', 'Azure DevOps', 'Jira'] },
  ]

  return (
    <section id="skills" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Technical <span className="text-primary">Skills</span>
        </motion.h2>

        {/* Pacman animation */}
        <div className="flex justify-center mb-12">
          <div className="relative w-48 h-12">
            {/* Pacman */}
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full"
              animate={{
                x: [0, 160],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                clipPath: 'polygon(0 0, 100% 50%, 0 100%, 70% 50%)',
              }}
            />
            {/* Dots */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                style={{ left: `${32 + i * 32}px` }}
                animate={{
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            {/* Ghost */}
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8"
              animate={{
                x: [160, 0],
                y: [0, -5, 0],
              }}
              transition={{
                x: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                },
                y: {
                  duration: 0.5,
                  repeat: Infinity,
                },
              }}
            >
              <svg viewBox="0 0 24 24" className="text-red-500 fill-current">
                <path d="M12 2C7.58 2 4 5.58 4 10v10l3-3 3 3 3-3 3 3 3-3v-10c0-4.42-3.58-8-8-8zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
              <div className="space-y-4">
                {category.skills.map((skillName) => {
                  const skill = data.skills.find((s) => s.name === skillName)
                  const level = skill ? parseInt(skill.level.replace('%', ''), 10) : 0

                  return (
                    <div key={skillName}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skillName}</span>
                        <span className="text-primary">{skill?.level || '0%'}</span>
                      </div>
                      <Progress value={level} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
