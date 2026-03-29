# src/components/ui/ - Design System

> L2 | 父级: /CLAUDE.md

设计系统原子组件库，基于 shadcn/ui + base-ui primitives。

## 成员清单

| 文件 | 职责 | 关键技术 |
|------|------|----------|
| button.tsx | 按钮 - 渐变背景 + 3D 阴影 + hover 缩放 | CVA, Framer Motion |
| card.tsx | 卡片 - elevated/inset/primary 三种变体 | CSS Variables |
| badge.tsx | 徽章 - 渐变背景 + 阴影 | class-variance-authority |
| avatar.tsx | 头像 - 立体阴影 + hover 增强 | base-ui/avatar |
| dialog.tsx | 对话框 - 渐变毛玻璃 + 红色关闭按钮 | base-ui/dialog |
| input.tsx | 输入框 - 内凹阴影效果 | base-ui/input |
| progress.tsx | 进度条 - inset 轨道 + 发光指示器 | base-ui/progress |
| accordion.tsx | 手风琴 - 展开收起动画 | base-ui/accordion |
| dropdown-menu.tsx | 下拉菜单 - 卡片样式 | base-ui/dropdown-menu |
| sheet.tsx | 侧边栏 - 右滑面板 | base-ui/dialog |
| separator.tsx | 分隔线 - 渐变样式 | base-ui/separator |
| label.tsx | 标签 - 简洁样式 | base-ui/label |
| scroll-area.tsx | 滚动区域 - 自定义滚动条 | base-ui/scroll-area |
| navigation-menu.tsx | 导航菜单 | base-ui/navigation-menu |
| index.ts | 统一导出所有组件 | - |

## 设计规范

### Neumorphism Token

```typescript
const NEUMORPHISM = {
  default: {
    bg: 'linear-gradient(135deg, var(--primary) 0%, ...)',
    shadow: '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
    hoverShadow: '0 6px 20px color-mix(in srgb, var(--primary) 45%, transparent), ...',
  },
}
```

### 圆角规范

- `rounded-xl` - 16px (小元素)
- `rounded-2xl` - 20px (默认)
- `rounded-3xl` - 24px (大元素/卡片)

[PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
