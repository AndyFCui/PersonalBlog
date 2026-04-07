# src/pages/admin/resume-editor/ - Resume Editor Module

> L2 | 父级: /CLAUDE.md

简历编辑器模块，采用组件化拆分，提升 Vite 编译效率。

## 成员清单

| 文件 | 职责 | 导出 |
|------|------|------|
| `index.tsx` | 主容器，整合所有子组件 | `AdminResumeEditor` |
| `MainInfoEditor.tsx` | 编辑个人信息（姓名、职业、头像等） | `MainInfoEditor` |
| `ResumeEditor.tsx` | 编辑简历（工作+教育经历） | `ResumeEditor` |
| `WorkExperienceForm.tsx` | 工作经历表单 | `WorkExperienceForm` |
| `EducationForm.tsx` | 教育经历表单 | `EducationForm` |
| `PortfolioEditor.tsx` | 编辑作品集 | `PortfolioEditor` |
| `ImageGallery.tsx` | 图片库管理 | `ImageGallery` |
| `CropModal.tsx` | 图片裁剪弹窗 | `CropModal` |
| `utils.ts` | 共享工具函数和常量 | `deepClone`, `Crop`, `TABS`, `STORAGE_BASE` |

## 架构说明

```
AdminResumeEditor (index.tsx)
├── MainInfoEditor (MainInfoEditor.tsx)
│   └── CropModal (CropModal.tsx)
├── ResumeEditor (ResumeEditor.tsx)
│   ├── WorkExperienceForm (WorkExperienceForm.tsx)
│   └── EducationForm (EducationForm.tsx)
├── PortfolioEditor (PortfolioEditor.tsx)
└── ImageGallery (ImageGallery.tsx)
```

## 状态管理

- `useResumeAdmin` hook 提供数据获取和保存
- 各子组件通过 props 接收 `onChange` 回调，避免直接修改 ref

## 依赖

- `@/hooks/useResumeAdmin` - 数据操作
- `@/types/resume` - 类型定义
- `@/lib/supabase` - Supabase 客户端
- `@/components/ui/*` - UI 组件

[PROTOCOL]: 变更时更新此头部，然后检查 /CLAUDE.md
