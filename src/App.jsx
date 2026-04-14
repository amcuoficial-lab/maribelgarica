import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminLibrosPage from './pages/AdminLibrosPage'
import AdminLibroCuentosPage from './pages/AdminLibroCuentosPage'
import AdminConfigPage from './pages/AdminConfigPage'
import AdminCuentosPage from './pages/AdminCuentosPage'
import CuentoPage from './pages/CuentoPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/admin/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route path="/" element={<HomePage />} />
      <Route path="/cuento/:token" element={<CuentoPage />} />

      {/* Panel admin */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route
        path="/admin/libros"
        element={
          <ProtectedRoute>
            <AdminLibrosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/libros/:libroId"
        element={
          <ProtectedRoute>
            <AdminLibroCuentosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/config"
        element={
          <ProtectedRoute>
            <AdminConfigPage />
          </ProtectedRoute>
        }
      />
      {/* Ruta legacy de cuentos sueltos */}
      <Route
        path="/admin/cuentos"
        element={
          <ProtectedRoute>
            <AdminCuentosPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
