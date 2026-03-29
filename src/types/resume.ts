// ============================================================================
// Resume Data Types
// [INPUT]: resumeData.json
// [OUTPUT]: Type-safe interfaces for all resume data
// [POS]: src/types/resume.ts - Type definitions for resume data structure
// [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
// ============================================================================

export interface SocialLink {
  name: string
  url: string
  className: string
}

export interface TechStackItem {
  name: string
  image: string
}

export interface TechStackCategory {
  category: string
  items: TechStackItem[]
}

export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

export interface Intro {
  role: string
  company: string
}

export interface MainData {
  name: string
  occupation: string
  description: string
  image: string
  intro: Intro
  bio: string
  skills: TechStackCategory[]
  contactmessage: string
  email: string
  phone: string
  city: string
  nameUnderImage: string
  address: Address
  website: string
  resumedownload: string
  social: SocialLink[]
}

export interface Education {
  school: string
  degree: string
  graduated: string
  Coursework: string
  description: string
  image: string
  honor: string
  awards: string
}

export interface WorkExperience {
  company: string
  title: string
  years: string
  image: string
  description: string[]
}

export interface Skill {
  name: string
  level: string
}

export interface ResumeData {
  skillmessage: string
  education: Education[]
  work: WorkExperience[]
  skills: Skill[]
}

export interface PortfolioProject {
  title: string
  category: string
  description: string[]
  image: string
  url: string
}

export interface PortfolioData {
  projects: PortfolioProject[]
}

export interface ResumeDataJSON {
  main: MainData
  resume: ResumeData
  portfolio: PortfolioData
}
