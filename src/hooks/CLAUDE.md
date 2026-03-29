# src/hooks/ - Shared Hooks

> L2 | 父级: /CLAUDE.md

共享 React Hooks。

## 成员清单

| 文件 | 职责 | 签名 |
|------|------|------|
| useResumeData.ts | 获取简历数据 | `() -> { data, loading, error }` |

## useResumeData

### 接口

```typescript
interface ResumeDataJSON {
  main: MainData      // 个人信息
  resume: ResumeData   // 简历数据 (工作、教育、技能)
  portfolio: PortfolioData  // 项目数据
}

interface UseResumeDataResult {
  data: ResumeDataJSON | null
  loading: boolean
  error: string | null
}
```

### 数据来源

- 开发环境：`/resumeData.json` (public folder)
- 请求方式：Fetch API

### 状态流转

```
loading: true  →  data loaded  →  loading: false
                 ↓
            error occurred  →  error: string

```

[PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
