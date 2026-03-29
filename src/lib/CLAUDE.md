# src/lib/ - Shared Utilities

> L2 | 父级: /CLAUDE.md

共享工具函数和状态管理。

## 成员清单

| 文件 | 职责 | 导出 |
|------|------|------|
| utils.ts | className 拼接工具 | `cn()` |
| theme.ts | 主题状态管理 (Zustand) | `useThemeStore` |

## cn() - Class Name Utility

基于 `clsx` + `tailwind-merge`，合并 Tailwind 类名。

```typescript
// 示例
cn('px-2 py-1', condition && 'bg-red-500')
// condition 为 false 时返回 'px-2 py-1'
// condition 为 true 时返回 'px-2 py-1 bg-red-500'
```

## useThemeStore - Theme State

Zustand store 管理 Dark/Light 主题。

```typescript
interface ThemeState {
  theme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}
```

### 持久化

- Storage: `localStorage`
- Key: `theme-storage`

### DOM 同步

```typescript
// 切换主题时同步更新
document.documentElement.classList.remove('dark', 'light')
document.documentElement.classList.add(newTheme)
```

## CSS Variables 主题定义

| Variable | Dark | Light |
|----------|------|-------|
| --background | `rgb(35, 35, 50)` | `rgb(250, 250, 255)` |
| --foreground | `rgb(235, 235, 240)` | `rgb(30, 30, 40)` |
| --primary | `rgb(0, 140, 255)` | `rgb(0, 130, 240)` |
| --secondary | `rgb(55, 55, 75)` | `rgb(240, 240, 245)` |

[PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
