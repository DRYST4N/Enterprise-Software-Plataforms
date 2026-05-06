import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import type {ReactNode} from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Festivales from './pages/Festivales';
import Empresa from './pages/Empresa';

// Ruta protegida por rol
const PrivateRoute = ({ children, role }: { children: ReactNode; role: 'Cliente' | 'Empresa' }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'Empresa' ? '/empresa' : '/festivales'} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/login" />} />

      <Route path="/festivales" element={
        <PrivateRoute role="Cliente">
          <Festivales />
        </PrivateRoute>
      } />

      <Route path="/empresa" element={
        <PrivateRoute role="Empresa">
          <Empresa />
        </PrivateRoute>
      } />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;