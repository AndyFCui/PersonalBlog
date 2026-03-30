# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Andy (Xiang-Yu) Cui built with React 19, TypeScript, Vite, and shadcn/ui design system.

## Tech Stack

React 19 + TypeScript + Vite + TailwindCSS v4 + shadcn/ui + Framer Motion + React Router

## Commands

```bash
npm install           # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
```

## Architecture

### Directory Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui design system components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
├── pages/
│   ├── portfolio.tsx     # Main portfolio page
│   └── design-system.tsx # shadcn/ui component showcase
├── sections/         # Portfolio section components
│   ├── header.tsx
│   ├── about.tsx
│   ├── experience.tsx
│   └── ...
├── hooks/
│   └── useResumeData.ts  # Data fetching hook
├── lib/
│   ├── utils.ts          # Utility functions (cn)
│   └── theme.ts          # Theme store (zustand)
└── types/
    └── resume.ts         # TypeScript type definitions
```

### Data Flow

```
resumeData.json → useResumeData (hook) → pages → sections → ui components
```

### Routing

- `/` - Portfolio page
- `/design-system` - Component showcase

### Design System

All design tokens come from shadcn/ui theme system:

- **Colors**: Use CSS variables (--primary, --secondary, --accent, --background, --foreground, etc.)
- **Components**: Use shadcn/ui components exclusively
- **Theme**: Dark/light mode via `dark` class on `<html>`

#### Neumorphism Design Language

Components use a neumorphism (micro-skeuomorphism) design language with:

- **Gradient backgrounds**: Multi-stop gradients using `color-mix()` for depth
- **3D shadows**: Layered shadows creating raised/inset effects
- **Hover micro-interactions**: Scale and shadow transitions on hover
- **Glow effects**: Colored shadows for interactive feedback

Design token structure:
```typescript
const NEUMORPHISM = {
  default: {
    bg: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 85%, black) 100%)',
    shadow: '0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
    hoverShadow: '0 6px 20px color-mix(in srgb, var(--primary) 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)',
  },
  // secondary, destructive, accent variants...
}
```

Components with neumorphism:
- **Button**: Gradient background + 3D shadow, hover scale effect
- **Card**: Elevated (raised) and inset variants with hover transitions
- **Input**: Inset shadow effect for pressed appearance
- **Badge**: Gradient background with subtle shadow
- **Progress**: Inset track + glowing gradient indicator
- **Avatar**: Raised shadow effect with hover enhancement

## Key Implementation Notes

- Theme toggle uses Zustand store with persistence
- shadcn/ui components use base-ui primitives
- Framer Motion for animations
- Matrix-style text effect in header hero
- Pacman animation in Skills section

## Images

- Profile: `public/images/profilepic.jpg`
- Resume PDF: `public/images/CUIXIANGYU.pdf`
- Header background: `public/images/header-background.jpg`
- Tech logos: `public/images/logos/`
- Project images: `public/images/portfolio/`
