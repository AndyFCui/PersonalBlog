import { z } from 'zod'

const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
})

const IntroSchema = z.object({
  role: z.string(),
  company: z.string(),
})

const SocialLinkSchema = z.object({
  name: z.string(),
  url: z.string(),
  className: z.string(),
})

const TechStackItemSchema = z.object({
  name: z.string(),
  image: z.string(),
})

const TechStackCategorySchema = z.object({
  category: z.string(),
  items: z.array(TechStackItemSchema),
})

const MainDataSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  description: z.string().optional(),
  image: z.string(),
  intro: IntroSchema,
  bio: z.string(),
  skills: z.array(TechStackCategorySchema),
  contactmessage: z.string(),
  email: z.string(),
  phone: z.string(),
  city: z.string(),
  nameUnderImage: z.string(),
  address: AddressSchema,
  website: z.string(),
  resumedownload: z.string(),
  social: z.array(SocialLinkSchema),
})

const EducationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  graduated: z.string(),
  Coursework: z.string(),
  description: z.string(),
  image: z.string(),
  honor: z.string(),
  awards: z.string(),
})

const WorkExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  years: z.string(),
  image: z.string(),
  description: z.array(z.string()),
})

const SkillSchema = z.object({
  name: z.string(),
  level: z.string(),
})

const ResumeDataSchema = z.object({
  skillmessage: z.string(),
  education: z.array(EducationSchema),
  work: z.array(WorkExperienceSchema),
  skills: z.array(SkillSchema),
})

const PortfolioProjectSchema = z.object({
  title: z.string(),
  category: z.string(),
  description: z.array(z.string()),
  image: z.string(),
  url: z.string(),
})

const PortfolioDataSchema = z.object({
  projects: z.array(PortfolioProjectSchema),
})

export const ResumeDataJSONSchema = z.object({
  main: MainDataSchema,
  resume: ResumeDataSchema,
  portfolio: PortfolioDataSchema,
})

export type ValidatedResumeData = z.infer<typeof ResumeDataJSONSchema>

export function validateResumeData(data: unknown) {
  const result = ResumeDataJSONSchema.safeParse(data)
  if (!result.success) {
    console.error('Resume data validation failed:', result.error.issues)
    return null
  }
  return result.data
}
