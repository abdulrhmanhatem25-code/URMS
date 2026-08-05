import AppRoutes from '@/app/router/AppRoutes'

export default function App() {
  // Auth state is hydrated automatically from localStorage via zustand/persist
  // Token refresh will be handled automatically by Axios interceptors if a request fails with 401
  return <AppRoutes />
}
