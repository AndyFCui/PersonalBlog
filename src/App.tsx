import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/error-boundary'
import { AuthProvider } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'

const PortfolioPage = lazy(() => import('@/pages/portfolio').then(m => ({ default: m.PortfolioPage })))
const DesignSystemPage = lazy(() => import('@/pages/design-system').then(m => ({ default: m.DesignSystemPage })))
const BlogPage = lazy(() => import('@/pages/blog').then(m => ({ default: m.BlogPage })))
const AdminLogin = lazy(() => import('@/pages/admin/login').then(m => ({ default: m.AdminLogin })))
const AdminBlogList = lazy(() => import('@/pages/admin/blog-list').then(m => ({ default: m.AdminBlogList })))
const AdminBlogEditor = lazy(() => import('@/pages/admin/blog-editor').then(m => ({ default: m.BlogEditor })))
const AdminCategoryList = lazy(() => import('@/pages/admin/category-list').then(m => ({ default: m.AdminCategoryList })))
const AdminAuthorEdit = lazy(() => import('@/pages/admin/author-edit').then(m => ({ default: m.AdminAuthorEdit })))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="/blog" element={<BlogPage />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/blogs" element={<AdminLayout><AdminBlogList /></AdminLayout>} />
            <Route path="/admin/blog/new" element={<AdminLayout><AdminBlogEditor /></AdminLayout>} />
            <Route path="/admin/blog/:id/edit" element={<AdminLayout><AdminBlogEditor /></AdminLayout>} />
            <Route path="/admin/categories" element={<AdminLayout><AdminCategoryList /></AdminLayout>} />
            <Route path="/admin/author" element={<AdminLayout><AdminAuthorEdit /></AdminLayout>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export { App }
