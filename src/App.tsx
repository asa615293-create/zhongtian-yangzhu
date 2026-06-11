import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import MobileNav from './components/layout/MobileNav'
import Dashboard from './pages/Dashboard'
import ArchivePage from './pages/ArchivePage'
import DeliveryPage from './pages/DeliveryPage'
import PhotosPage from './pages/PhotosPage'
import MeasurementsPage from './pages/MeasurementsPage'
import SystemsPage from './pages/SystemsPage'
import FurnishingPage from './pages/FurnishingPage'
import DesignPage from './pages/DesignPage'
import BudgetPage from './pages/BudgetPage'
import { useAppStore } from './store/useAppStore'

function App() {
  const loadFromServer = useAppStore((s) => s.loadFromServer)
  const loaded = useAppStore((s) => s.loaded)

  useEffect(() => {
    loadFromServer()
  }, [loadFromServer])

  if (!loaded) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary text-lg">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/archive/delivery" element={<DeliveryPage />} />
            <Route path="/archive/photos" element={<PhotosPage />} />
            <Route path="/archive/measurements" element={<MeasurementsPage />} />
            <Route path="/archive/systems" element={<SystemsPage />} />
            <Route path="/furnishing" element={<FurnishingPage />} />
            <Route path="/furnishing/:roomId" element={<FurnishingPage />} />
            <Route path="/design" element={<DesignPage />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Routes>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

export default App
