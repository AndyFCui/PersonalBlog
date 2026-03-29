import { Routes, Route } from 'react-router-dom'
import { PortfolioPage } from '@/pages/portfolio'
import { DesignSystemPage } from '@/pages/design-system'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/design-system" element={<DesignSystemPage />} />
    </Routes>
  )
}
