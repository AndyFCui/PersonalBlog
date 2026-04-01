import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 状态管理
          'vendor-zustand': ['zustand'],
          // UI 组件库
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-avatar', '@radix-ui/react-progress', '@radix-ui/react-slot'],
          // 动画
          'vendor-motion': ['framer-motion'],
          // Markdown 编辑器
          'vendor-bytemd': ['@bytemd/react', '@bytemd/plugin-gfm', '@bytemd/plugin-mermaid'],
          // Mermaid 单独 chunk（很大）
          'vendor-mermaid': ['mermaid'],
          // KaTeX 数学公式
          'vendor-katex': ['katex'],
          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          // Icons
          'vendor-lucide': ['lucide-react'],
          // Base UI
          'vendor-base': ['@base-ui/react'],
        },
      },
    },
  },
})
