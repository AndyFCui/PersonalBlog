import { Routes, Route } from 'react-router-dom'
import { PortfolioPage } from '@/pages/portfolio'


export function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/design-system" element={<DesignSystemPage />} />
    </Routes>
  )
}
