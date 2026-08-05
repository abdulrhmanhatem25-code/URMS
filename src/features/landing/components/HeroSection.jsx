import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LogIn, UserPlus, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguageStore } from '@/app/store/useLanguageStore'

const content = {
  ar: {
    badge: 'منصة الطلبات الجامعية',
    title: 'نظام إدارة طلبات الكليات',
    subtitle: 'منصة رقمية متكاملة تُسهّل على الطلاب والمعيدين والموظفين إنشاء ومتابعة الطلبات الأكاديمية والإدارية بشكل سريع وآمن.',
    loginBtn: 'تسجيل الدخول',
    registerBtn: 'إنشاء حساب (للطلاب)',
    stats: [
      { value: 'إدارة متكاملة', label: 'لجميع الطلبات' },
      { value: 'متابعة فورية', label: 'لحالة الطلب' },
      { value: 'آمن وموثوق', label: 'بيانات محمية' },
    ],
  },
  en: {
    badge: 'University Request Platform',
    title: 'College Request Management System',
    subtitle: 'A complete digital platform that enables students, assistants, and staff to create and track academic and administrative requests quickly and securely.',
    loginBtn: 'Login',
    registerBtn: 'Register (Students)',
    stats: [
      { value: 'Full Management', label: 'For all requests' },
      { value: 'Real-time Tracking', label: 'Request status' },
      { value: 'Secure & Reliable', label: 'Protected data' },
    ],
  },
}

export default function HeroSection() {
  const { lang, dir } = useLanguageStore()
  const tx = content[lang]
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section dir={dir} className="relative overflow-hidden py-20 md:py-28">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
          <GraduationCap className="w-4 h-4" />
          {tx.badge}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
          {tx.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {tx.subtitle}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/login">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 h-11 px-6">
              <LogIn className="w-4 h-4" />
              {tx.loginBtn}
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="gap-2 h-11 px-6">
              <UserPlus className="w-4 h-4" />
              {tx.registerBtn}
              <Arrow className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
          {tx.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-base font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
