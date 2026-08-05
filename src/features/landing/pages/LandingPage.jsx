import { useLanguageStore } from '@/app/store/useLanguageStore'
import LandingNavbar from '../components/LandingNavbar'
import HeroSection from '../components/HeroSection'
import FormsSection from '../components/FormsSection'

export default function LandingPage() {
  const { dir } = useLanguageStore()

  return (
    <div dir={dir} className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingNavbar />

      <main className="flex-1">
        <HeroSection />

        {/* Divider */}
        <div className="container mx-auto px-4 md:px-8">
          <div className="h-px bg-border" />
        </div>

        <FormsSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 md:px-8 text-center text-xs text-muted-foreground">
          {dir === 'rtl'
            ? '© 2026 نظام إدارة طلبات الكليات — URMS'
            : '© 2026 University Request Management System — URMS'}
        </div>
      </footer>
    </div>
  )
}
