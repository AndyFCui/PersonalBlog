# src/types/ - TypeScript Types

> L2 | 父级: /CLAUDE.md

TypeScript 类型定义，统一数据模型。

## 成员清单

| 文件 | 职责 | 导出 |
|------|------|------|
| resume.ts | 简历数据结构定义 | MainData, ResumeData, PortfolioData, etc. |

## 数据模型

### MainData - 个人信息

```typescript
interface MainData {
  name: string              // 全名 (Matrix 打字机效果)
  occupation: string        // 职业
  description: string       // 描述
  image: string             // 头像图片路径
  intro: { role, company }  // 简短介绍
  bio: string               // Biography
  skills: TechStackCategory[]  // 技能分类
  contactmessage: string   // 联系留言
  email: string
  phone: string
  city: string
  nameUnderImage: string   // 头像下方名字
  address: Address
  website: string
  resumedownload: string   // 简历下载路径
  social: SocialLink[]      // 社交链接
}
```

### ResumeData - 简历数据

```typescript
interface ResumeData {
  skillmessage: string
  education: Education[]     // 教育经历
  work: WorkExperience[]     // 工作经历
  skills: Skill[]            // 技能列表
}

interface WorkExperience {
  company: string
  title: string
  years: string
  image: string
  description: string[]      // 工作描述数组
}

interface Education {
  school: string
  degree: string
  graduated: string
  Coursework: string
  description: string
  image: string
  honor: string
  awards: string
}
```

### PortfolioData - 项目数据

```typescript
interface PortfolioData {
  projects: PortfolioProject[]
}

interface PortfolioProject {
  title: string
  category: string
  description: string[]
  image: string
  url: string
}
```

### TechStackCategory - 技能分类

```typescript
interface TechStackCategory {
  category: string           // 分类名 (Cloud & DevOps, AI & Development Tools, etc.)
  items: TechStackItem[]     // 该分类下的技能
}

interface TechStackItem {
  name: string               // 技能名
  image: string              // Logo 图片路径
}
```

## ResumeDataJSON - 完整结构

```typescript
interface ResumeDataJSON {
  main: MainData
  resume: ResumeData
  portfolio: PortfolioData
}
```

[PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
