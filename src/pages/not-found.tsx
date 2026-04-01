import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Not Found</h2>
        <p className="text-muted-foreground mb-2">您访问的页面不存在，或者正在开发中</p>
        <p className="text-sm text-muted-foreground mb-8">程序员正在拼命开发中...</p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  )
}
