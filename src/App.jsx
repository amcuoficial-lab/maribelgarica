import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminCuentosPage from './pages/AdminCuentosPage'
import CuentoPage from './pages/CuentoPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/admin/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route
        path="/admin/cuentos"
        element={
          <ProtectedRoute>
            <AdminCuentosPage />
          </ProtectedRoute>
        }
      />
      <Route path="/cuento/:token" element={<CuentoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
