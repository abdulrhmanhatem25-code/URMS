import { Link, useLocation } from 'react-router-dom'
import { Rocket, Home, Info, Layers, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            URMS App
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/">
            <Button variant={isActive('/') ? 'default' : 'ghost'} size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              الرئيسية
            </Button>
          </Link>
          <Link to="/about">
            <Button variant={isActive('/about') ? 'default' : 'ghost'} size="sm" className="gap-2">
              <Info className="h-4 w-4" />
              عن المشروع
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
