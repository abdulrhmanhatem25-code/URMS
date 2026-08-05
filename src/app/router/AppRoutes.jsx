import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/features/landing/pages/LandingPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ProtectedRoute from './ProtectedRoute'
import GuestRoute from './GuestRoute'
import AdminLayout from '@/features/admin/layout/AdminLayout'
import AdminFormsPage from '@/features/admin/pages/AdminFormsPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ───────────────────────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* ── Super Admin ───────────────────────────────────────────────────── */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['SuperAdmin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Index → redirect to forms */}
        <Route index element={<Navigate to="forms" replace />} />
        <Route path="forms" element={<AdminFormsPage />} />
      </Route>

      {/* ── Other dashboards (Sprint 3+) ──────────────────────────────────── */}
      {/*
      <Route path="/dashboard/student/*" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout /></ProtectedRoute>} />
      <Route path="/dashboard/advisor/*" element={<ProtectedRoute allowedRoles={['Advisor']}><AdvisorLayout /></ProtectedRoute>} />
      <Route path="/dashboard/secretary/*" element={<ProtectedRoute allowedRoles={['Secretary']}><SecretaryLayout /></ProtectedRoute>} />
      */}

      {/* ── Catch-all ─────────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
