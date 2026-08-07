import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '@/shared/layout/DashboardLayout'

// Lazy loaded pages
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const AdminFormsPage = lazy(() => import('@/features/admin/pages/AdminFormsPage'))
const AllRequestsPage = lazy(() => import('@/features/requests/pages/AllRequestsPage'))
const RequestsPage = lazy(() => import('@/features/requests/pages/RequestsPage'))
const SubmitRequestPage = lazy(() => import('@/features/requests/pages/SubmitRequestPage'))
const MyRequestsPage = lazy(() => import('@/features/student/pages/MyRequestsPage'))

// Fallback loader
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public ───────────────────────────────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Unified Dashboard Layout (Role-Protected) ─────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect for /dashboard based on role could be handled inside DashboardLayout or here */}
          
          {/* Admin routes */}
          <Route path="admin" element={<Navigate to="forms" replace />} />
          <Route path="admin/forms" element={<ProtectedRoute allowedRoles={['SuperAdmin']}><AdminFormsPage /></ProtectedRoute>} />
          <Route path="admin/requests" element={<ProtectedRoute allowedRoles={['SuperAdmin']}><RequestsPage basePath="/dashboard/admin/requests" /></ProtectedRoute>} />
          <Route path="admin/requests/:formId" element={<ProtectedRoute allowedRoles={['SuperAdmin']}><SubmitRequestPage /></ProtectedRoute>} />
          <Route path="admin/manage-requests" element={<ProtectedRoute allowedRoles={['SuperAdmin']}><AllRequestsPage /></ProtectedRoute>} />
          
          {/** Academic Advisor */}
          <Route path="advisor" element={<Navigate to="my-requests" replace />} />
          <Route path="advisor/manage-requests" element={<ProtectedRoute allowedRoles={['AcademicAdvisor']}><AllRequestsPage /></ProtectedRoute>} />

          {/* Student routes */} 
          <Route path="student" element={<Navigate to="requests" replace />} />
          <Route path="student/requests" element={<ProtectedRoute allowedRoles={['Student']}><RequestsPage basePath="/dashboard/student/requests" /></ProtectedRoute>} />
          <Route path="student/requests/:formId" element={<ProtectedRoute allowedRoles={['Student']}><SubmitRequestPage /></ProtectedRoute>} />
          <Route path="student/my-requests" element={<ProtectedRoute allowedRoles={['Student']}><MyRequestsPage /></ProtectedRoute>} />
        </Route>

        {/* ── Catch-all ─────────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
