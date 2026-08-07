import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import Sidebar from './Sidebar'
import Header from './Header'
import { cn } from '@/lib/utils'

export default function DashboardLayout() {
  const { dir } = useLanguageStore()
  
  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false)
  // State for desktop sidebar toggle
  const [desktopOpen, setDesktopOpen] = useState(true)
  
  // Screen size detection
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div dir={dir} className="min-h-screen bg-background flex overflow-hidden">
      
      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 transition-all duration-300 ease-in-out lg:relative",
          // Mobile state
          isMobile && (
            dir === 'rtl'
              ? mobileOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full'
              : mobileOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full'
          ),
          // Desktop state
          !isMobile && (
            desktopOpen ? 'w-64' : 'w-20'
          ),
          // Mobile always full width (or 256px) when open
          isMobile && 'w-64'
        )}
      >
        <Sidebar
          isOpen={isMobile ? true : desktopOpen}
          isMobile={isMobile}
          onToggle={() => setDesktopOpen(prev => !prev)}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header onMobileMenuClick={() => setMobileOpen(true)} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-secondary/10">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
