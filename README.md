# Andy Cui - Personal Portfolio

Modern portfolio website built with React 19, TypeScript, Vite, and shadcn/ui design system.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: TailwindCSS v4 + CSS Variables
- **UI**: shadcn/ui (base-ui primitives)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **State**: Zustand
- **Routing**: React Router

## Features

### Sections

| Section | Description |
|---------|-------------|
| **Header** | Navigation + Hero with Matrix typewriter effect, Home/Info/Blog links |
| **About** | Avatar with glow, contact cards, biography, tech stack badges |
| **Experience** | Timeline layout with hover-to-expand details |
| **Education** | Timeline layout for academic background |
| **Portfolio** | Project cards with gradient modal dialog |
| **Footer** | Email CTA, social links |

### Design System

- **Neumorphism** - 3D shadows with gradient backgrounds
- **Dark/Light Theme** - Fluorescent gray tones with persistence
- **Responsive** - Mobile-first approach

### Routes

| Path | Page |
|------|------|
| `/` | Portfolio (main page) |
| `/design-system` | Component showcase |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Design system components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── sections/     # Page sections
│       ├── header.tsx
│       ├── about.tsx
│       ├── experience.tsx
│       └── ...
├── pages/
│   ├── portfolio.tsx  # Main page
│   └── design-system.tsx
├── hooks/
│   └── useResumeData.ts
├── lib/
│   ├── utils.ts      # cn() utility
│   └── theme.ts      # Theme store
├── types/
│   └── resume.ts      # Type definitions
├── App.tsx
└── main.tsx
```

## Data Configuration

Edit `public/resumeData.json` to update:
- Personal information (name, bio, contact)
- Work experience
- Education history
- Portfolio projects

## Color Palette

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| Primary | `rgb(0, 140, 255)` | `rgb(0, 130, 240)` |
| Background | `rgb(35, 35, 50)` | `rgb(250, 250, 255)` |
| Foreground | `rgb(235, 235, 240)` | `rgb(30, 30, 40)` |

## License

MIT
