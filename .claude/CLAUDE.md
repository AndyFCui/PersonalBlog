# PersonalBlog - Portfolio Website

React 19 + TypeScript + Vite + TailwindCSS v4 + shadcn/ui + Framer Motion

## 技术栈

| 层级 | 技术 |
|------|------|
| 构建 | Vite |
| 语言 | TypeScript |
| 框架 | React 19 |
| 样式 | TailwindCSS v4 + CSS Variables |
| UI | shadcn/ui (base-ui primitives) |
| 图标 | Lucide React |
| 动画 | Framer Motion |
| 状态 | Zustand |
| 路由 | React Router |

## 项目结构

```
PersonalBlog/
├── public/
│   ├── images/                    # 静态图片资源
│   │   ├── logos/               # 技术栈 Logo
│   │   ├── portfolio/           # 项目图片
│   │   ├── header-background.jpg
│   │   └── profilepic.jpg
│   ├── resumeData.json           # 简历数据 (API 数据源)
│   └── CUIXIANGYU.pdf           # 简历 PDF
│
├── src/
│   ├── components/               # 组件层
│   │   ├── ui/                  # 设计系统原子组件 (L2: design-system/)
│   │   │   ├── button.tsx       # 按钮 - 渐变 + 3D 阴影
│   │   │   ├── card.tsx         # 卡片 - 凸起/凹陷样式
│   │   │   ├── badge.tsx        # 徽章 - 渐变背景
│   │   │   ├── avatar.tsx       # 头像 - 立体阴影
│   │   │   ├── dialog.tsx        # 对话框 - 渐变毛玻璃
│   │   │   ├── input.tsx        # 输入框 - 内凹效果
│   │   │   ├── progress.tsx      # 进度条 - 发光效果
│   │   │   ├── accordion.tsx     # 手风琴
│   │   │   ├── dropdown-menu.tsx # 下拉菜单
│   │   │   ├── sheet.tsx         # 侧边栏
│   │   │   ├── separator.tsx      # 分隔线
│   │   │   ├── label.tsx         # 标签
│   │   │   ├── scroll-area.tsx   # 滚动区域
│   │   │   └── index.ts          # 统一导出
│   │   │
│   │   └── sections/             # 页面区块组件 (L2: sections/)
│   │       ├── header.tsx        # 导航 + Hero (含 Matrix 打字机)
│   │       ├── about.tsx          # 关于我 + 技能栈
│   │       ├── experience.tsx     # 工作经历 (悬停展开)
│   │       ├── education.tsx      # 教育背景
│   │       ├── portfolio.tsx       # 项目展示 (Dialog)
│   │       ├── footer.tsx         # 页脚
│   │       └── index.ts           # 统一导出
│   │
│   ├── pages/                   # 页面组合 (L2: pages/)
│   │   ├── portfolio.tsx        # 主页面 - 整合所有 sections
│   │   └── design-system.tsx     # 设计系统展示页
│   │
│   ├── hooks/                   # 共享 Hooks (L2: hooks/)
│   │   └── useResumeData.ts     # 简历数据获取
│   │
│   ├── lib/                     # 共享工具 (L2: lib/)
│   │   ├── utils.ts             # cn() 工具函数
│   │   └── theme.ts             # Zustand 主题状态管理
│   │
│   ├── types/                   # 类型定义 (L2: types/)
│   │   └── resume.ts            # 简历数据模型
│   │
│   ├── App.tsx                  # 根组件 + 路由
│   ├── main.tsx                 # 入口文件
│   └── index.css                # 全局样式 + CSS Variables
│
├── index.html                   # HTML 入口
├── package.json
├── vite.config.ts              # Vite 配置
├── tailwind.config.js          # TailwindCSS 配置
└── postcss.config.js           # PostCSS 配置
```

## 设计系统

### Neumorphism 微拟物设计语言

所有组件使用微拟物设计，带有 3D 阴影效果：

**颜色 (CSS Variables):**
- `--primary` - 科技蓝 `rgb(0, 140, 255)`
- `--secondary` - 深色玻璃
- `--accent` - 青色发光
- `--background` - 深空背景
- `--foreground` - 前景文字

**Light Theme:**
- 背景: `rgb(250, 250, 255)`
- 前景: 深灰

**Dark Theme (荧光灰):**
- 背景: `rgb(35, 35, 50)`
- 前景: 白色

**3D 阴影结构:**
```css
box-shadow: 8px 8px 16px rgba(0,0,0,0.4),
            -4px -4px 12px rgba(255,255,255,0.05);
```

### 路由

| 路径 | 页面 |
|------|------|
| `/` | Portfolio 主页面 |
| `/design-system` | 设计系统展示 |

## 核心功能

### Header
- Matrix 打字机效果
- 固定导航栏 (滚动后显示背景)
- Home / Info (下拉) / Blog 占位

### About
- 头像 + 发光效果
- 联系信息卡片
- Biography
- Tech Stack 徽章网格

### Experience
- 时间线布局
- 悬停自动展开详情 (Framer Motion)

### Portfolio
- 网格卡片布局
- Dialog 弹窗详情

### Footer
- Email Me 按钮
- 社交链接

### 主题切换
- Dark/Light 模式
- Zustand 持久化存储

## 开发命令

```bash
npm install           # 安装依赖
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run preview      # 预览构建
```

## 法则

- 组件保持纯净，不耦合业务数据
- 使用 CSS Variables 管理主题
- 所有组件遵循 neumorphism 设计语言
- 变更时更新 L2/L3 文档
