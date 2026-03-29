# Andy Cui - Personal Portfolio

Modern personal portfolio website built with React 19, TypeScript, Vite, and shadcn/ui design system.

**Live Demo**: https://andyfcui.com

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend SPA                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │   Header    │  │   Sections  │  │    Pages     │  │
│  │  (Hero+Nav) │  │  (UI Layer) │  │   (Compose)  │  │
│  └─────────────┘  └─────────────┘  └──────────────┘  │
│         │                │                  │           │
│  ┌─────────────────────────────────────────────────┐  │
│  │              Design System (UI)                   │  │
│  │  Button │ Card │ Dialog │ Badge │ Avatar │ ...  │  │
│  └─────────────────────────────────────────────────┘  │
│         │                │                  │           │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │   Hooks     │  │    Lib      │  │    Types     │  │
│  │ useResume   │  │ theme/utils │  │   resume     │  │
│  └─────────────┘  └─────────────┘  └──────────────┘  │
│                         │                              │
│              ┌──────────┴──────────┐                  │
│              │   public/             │                  │
│              │  resumeData.json     │                  │
│              │  (Static Data API)   │                  │
│              └───────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

### Architecture Type

**Frontend-Only SPA (Single Page Application)**

- No backend required
- Static JSON data served from `/public`
- React Router for client-side routing
- Zustand for state management with localStorage persistence

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | React | 19.x |
| **Language** | TypeScript | 5.x |
| **Build Tool** | Vite | 6.x |
| **Styling** | TailwindCSS | 4.x |
| **UI Components** | shadcn/ui (base-ui) | - |
| **Animation** | Framer Motion | 11.x |
| **Icons** | Lucide React | - |
| **State** | Zustand | - |
| **Routing** | React Router | 6.x |

---

## Project Structure

```
PersonalBlog/
├── public/                          # 静态资源 (直接复制到 dist/)
│   ├── images/                     # 图片资源
│   │   ├── logos/                 # 技术栈 Logo
│   │   ├── portfolio/              # 项目截图
│   │   ├── header-background.jpg   # Hero 背景图
│   │   └── profilepic.jpg          # 头像
│   ├── resumeData.json             # 简历数据 (JSON API)
│   └── CUIXIANGYU.pdf             # 简历 PDF 下载
│
├── src/                            # 源代码
│   │
│   ├── components/                 # 组件层
│   │   │
│   │   ├── ui/                    # ┬─ Design System 原子组件
│   │   │   │                      # │  (无业务逻辑，可复用)
│   │   │   ├── button.tsx        # │  按钮 - 渐变 + 3D 阴影
│   │   │   ├── card.tsx          # │  卡片 - elevated/inset/primary
│   │   │   ├── badge.tsx          # │  徽章 - 渐变背景
│   │   │   ├── avatar.tsx        # │  头像 - 立体阴影
│   │   │   ├── dialog.tsx        # │  对话框 - 渐变毛玻璃
│   │   │   ├── input.tsx         # │  输入框 - 内凹效果
│   │   │   ├── progress.tsx       # │  进度条 - 发光指示器
│   │   │   ├── accordion.tsx     # │  手风琴
│   │   │   ├── dropdown-menu.tsx  # │  下拉菜单
│   │   │   ├── sheet.tsx         # │  侧边栏
│   │   │   └── index.ts          # └─ 统一导出
│   │   │
│   │   └── sections/              # ├─ Page Section 区块组件
│   │       │                       #   (组合 ui 组件，构成页面区域)
│   │       ├── header.tsx        #   导航 + Hero (Matrix 打字机)
│   │       ├── about.tsx          #   关于我 (头像/联系/Bio/技能)
│   │       ├── experience.tsx     #   工作经历 (悬停展开)
│   │       ├── education.tsx       #   教育背景 (时间线)
│   │       ├── portfolio.tsx       #   项目展示 (Dialog 弹窗)
│   │       ├── footer.tsx         #   页脚 (联系方式)
│   │       └── index.ts           #   统一导出
│   │
│   ├── pages/                     # ┬─ Page 页面组合
│   │   │                           # │  (整合 sections 形成完整页面)
│   │   ├── portfolio.tsx          # │  Portfolio 主页面 /
│   │   └── design-system.tsx      # └─ 设计系统展示 /design-system
│   │
│   ├── hooks/                     # ┬─ Custom Hooks
│   │   └── useResumeData.ts       # └─ 简历数据获取
│   │
│   ├── lib/                       # ┬─ Shared Utilities
│   │   ├── utils.ts               # │  cn() - className 拼接
│   │   └── theme.ts               # └─ Zustand 主题状态管理
│   │
│   ├── types/                     # ┬─ TypeScript Types
│   │   └── resume.ts              # └─ 简历数据模型定义
│   │
│   ├── App.tsx                   # 根组件 + 路由配置
│   ├── main.tsx                  # 入口文件
│   └── index.css                 # 全局样式 + CSS Variables
│
├── index.html                     # HTML 入口
├── package.json                   # 依赖管理
├── vite.config.ts                 # Vite 配置
├── tailwind.config.js             # TailwindCSS 配置
├── postcss.config.js              # PostCSS 配置
├── tsconfig.json                  # TypeScript 配置
└── components.json                # shadcn/ui 配置
```

---

## Current Features

### Page Sections

| Section | Route | Description |
|---------|-------|-------------|
| **Header** | - | 固定导航栏 + Hero 区域，Matrix 打字机动画，Home/Info/Blog 导航 |
| **About** | #about | 头像发光效果，联系信息卡片，Biography，Tech Stack 徽章网格 |
| **Experience** | #experience | 时间线布局，公司 Logo，悬停自动展开详情 (Framer Motion) |
| **Education** | #education | 时间线布局，学校 Logo |
| **Portfolio** | #portfolio | 网格卡片，点击打开渐变 Dialog 弹窗 |
| **Footer** | #contact | Email Me 按钮，GitHub 社交链接 |

### UI Components (Design System)

| Component | Features |
|-----------|----------|
| **Button** | 渐变背景 + 3D 阴影 + hover 缩放 + active 按压反馈 |
| **Card** | 三种变体: elevated / inset / primary，hover 阴影增强 |
| **Badge** | 渐变背景 + 轻微阴影，hover 上浮 |
| **Avatar** | 立体阴影，hover 增强 |
| **Dialog** | 渐变毛玻璃背景，红色关闭按钮 (悬停变红) |
| **Input** | 内凹阴影效果 |
| **Progress** | inset 轨道 + 发光渐变指示器 |
| **Accordion** | 展开收起动画 |
| **DropdownMenu** | 卡片样式下拉菜单 |
| **Sheet** | 侧边栏滑动面板 |

### Interactive Features

- **Theme Toggle**: Dark/Light 模式切换，Zustand 持久化到 localStorage
- **Matrix Typewriter**: Hero 区域姓名打字机效果
- **Hover Expand**: Experience 卡片悬停自动展开详情
- **Portfolio Modal**: 项目卡片点击打开渐变弹窗

---

## Design System

### Neumorphism 微拟物设计

组件使用微拟物设计语言，带有 3D 阴影效果和渐变背景。

### Color Palette (CSS Variables)

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--primary` | `rgb(0, 140, 255)` | `rgb(0, 130, 240)` |
| `--secondary` | `rgb(55, 55, 75)` | `rgb(240, 240, 245)` |
| `--accent` | `rgb(0, 180, 255)` | `rgb(100, 180, 255)` |
| `--background` | `rgb(35, 35, 50)` | `rgb(250, 250, 255)` |
| `--foreground` | `rgb(235, 235, 240)` | `rgb(30, 30, 40)` |
| `--muted` | `rgb(70, 70, 95)` | `rgb(235, 235, 240)` |
| `--card` | `rgb(45, 45, 65)` | `rgb(245, 245, 250)` |
| `--border` | `rgb(80, 80, 110)` | `rgb(220, 220, 230)` |

### 3D Shadow Structure

```css
box-shadow: 8px 8px 16px rgba(0,0,0,0.4),
            -4px -4px 12px rgba(255,255,255,0.05),
            inset 0 1px 0 rgba(255,255,255,0.1);
```

### Border Radius

- `rounded-xl` - 16px (小元素)
- `rounded-2xl` - 20px (默认)
- `rounded-3xl` - 24px (大元素/卡片)

---

## Data Configuration

所有内容通过 `public/resumeData.json` 管理，无需修改代码即可更新。

### Data Structure

```json
{
  "main": {
    "name": "Andy Cui",
    "occupation": "5 Years PM...",
    "bio": "...",
    "email": "...",
    "phone": "...",
    "social": [...],
    "skills": [...],
    "resumedownload": "..."
  },
  "resume": {
    "work": [...],      // 工作经历
    "education": [...]   // 教育背景
  },
  "portfolio": {
    "projects": [...]    // 项目展示
  }
}
```

### 如何更新内容

1. 编辑 `public/resumeData.json`
2. 刷新页面即可看到更新

---

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Commands

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# TypeScript 类型检查
npm run lint
```

### 环境变量

无需配置环境变量，数据直接从 `public/resumeData.json` 加载。

---

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | PortfolioPage | Portfolio 主页面 |
| `/design-system` | DesignSystemPage | 设计系统组件展示 |

---

## Deployment

### Build

```bash
npm run build
# 输出: dist/
```

### Static Hosting

构建后的 `dist/` 目录可部署到任意静态托管服务：

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: GitHub Actions
- **AWS S3 + CloudFront**: 静态网站托管

---

## Future Enhancements

- [ ] Blog 功能 (导航栏占位)
- [ ] 评论区/留言板
- [ ] CMS 集成 (Contentful/Sanity)
- [ ] 国际化 (i18n)
- [ ] 更多动画效果

---

## License

MIT License - feel free to use this template for your personal portfolio.
