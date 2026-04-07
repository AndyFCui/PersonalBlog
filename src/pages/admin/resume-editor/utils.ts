/**
 * [INPUT]: 无依赖
 * [OUTPUT]: 导出工具函数和常量
 * [POS]: resume-editor 模块的共享工具层
 * [PROTOCOL]: 变更时更新此头部
 */

/* ------------------------- 工具函数：安全深拷贝 ------------------------- */
export function deepClone<T>(obj: T): T {
  if (!obj) return obj
  try {
    // Use JSON round-trip for plain data objects
    // This handles React state objects correctly (removes functions, DOM nodes, etc.)
    return JSON.parse(JSON.stringify(obj))
  } catch {
    // If JSON fails (circular ref), return as-is
    return obj
  }
}

export interface Crop {
  unit: 'px' | '%'
  x: number
  y: number
  width: number
  height: number
}

// Tabs
export const TABS = ['Main Info', 'Resume', 'Portfolio', 'Images']

// Base URL for Supabase storage
export const STORAGE_BASE = 'https://rlrzmqbdpjkpxbfdgnlm.supabase.co/storage/v1/object/public/blog-images/'
