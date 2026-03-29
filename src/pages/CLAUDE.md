# src/pages/ - Page Compositions

> L2 | 父级: /CLAUDE.md

页面组合组件，整合 sections 形成完整页面。

## 成员清单

| 文件 | 职责 | 路由 |
|------|------|------|
| portfolio.tsx | 主页面：整合 Header, About, Experience, Education, Portfolio, Footer | `/` |
| design-system.tsx | 设计系统展示页：所有 ui 组件示例 | `/design-system` |

## PortfolioPage 结构

```tsx
<min-h-screen>
  <Header />
  <About />
  <Experience />
  <Education />
  <Portfolio />
  <Footer />
</min-h-screen>
```

## 路由配置 (App.tsx)

```tsx
<Router>
  <Routes>
    <Route path="/" element={<PortfolioPage />} />
    <Route path="/design-system" element={<DesignSystemPage />} />
  </Routes>
</Router>
```

[PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
