# src/components/sections/ - Page Sections

> L2 | 父级: /CLAUDE.md

页面区块组件，组合 ui 组件形成完整页面区域。

## 成员清单

| 文件 | 职责 | 依赖 |
|------|------|------|
| header.tsx | 导航栏 + Hero 区域，Matrix 打字机动画 | Button, DropdownMenu, useThemeStore |
| about.tsx | 关于我区块：头像、联系信息、Biography、Tech Stack | Button, Avatar, Badge, Motion |
| experience.tsx | 工作经历：时间线布局，悬停展开详情 | Card, Avatar, Motion, AnimatePresence |
| education.tsx | 教育背景：时间线布局 | Card, Avatar, Motion |
| portfolio.tsx | 项目展示：网格卡片，点击弹窗详情 | Card, Dialog, Button, Motion |
| footer.tsx | 页脚：联系方式、社交链接 | Button, Motion |
| index.ts | 统一导出 | - |

## 数据流

```
resumeData.json
    ↓ useResumeData hook
PortfolioPage
    ↓ props
Sections (Header, About, Experience, ...)
```

## 组件独立性

各 Section 组件通过 props 接收数据，保持对 ui 组件的依赖，无跨 section 依赖。

### Header 特性
- 滚动监听：50px 后显示导航栏背景
- Matrix 打字机效果：80ms/字符
- Info 下拉菜单：Experience, Education, Portfolio, Contact
- 移动端：Sheet 侧边栏

### About 特性
- Avatar 发光脉冲动画
- 联系方式卡片 hover 效果
- Tech Stack Badge hover 上浮

### Experience 特性
- 状态管理：`hoveredIndex` 控制展开
- AnimatePresence 动画
- 悬停 0.3s 展开/折叠

[PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
