import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import type {ReactNode} from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Festivales from './pages/Festivales';
import Empresa from './pages/Empresa';
import Checkout from './pages/Checkout';
import MisCompras from './pages/MisCompras';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';

// Ruta protegida por rol
const PrivateRoute = ({ children, roles }: { children: ReactNode; roles: Array<'Cliente' | 'Empresa' | 'ADMIN'> }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role as 'Cliente' | 'Empresa' | 'ADMIN')) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'Empresa' ? '/empresa' : user.role ==='ADMIN' ? '/admin': '/festivales'} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/login" />} />

        <Route path="/festivales" element={
          <PrivateRoute roles={["Cliente"]}>
            <Festivales />
          </PrivateRoute>
        } />

        <Route path="/empresa" element={
          <PrivateRoute roles={["Empresa"]}>
            <Empresa />
          </PrivateRoute>
        } />
        <Route path="/checkout/:id" element={
          <PrivateRoute roles={["Cliente"]}>
            <Checkout />
          </PrivateRoute>
        } />
        <Route path="/mis-compras" element={
          <PrivateRoute roles={["Cliente"]}>
            <MisCompras />
          </PrivateRoute>
        } />

        <Route path="/me" element={
          <PrivateRoute roles={["Cliente", "Empresa"]}>
            <Perfil />
          </PrivateRoute>
        } />

        <Route path="/admin" element={
          <PrivateRoute roles={["ADMIN"]}>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/" element={ <LandingPage />} />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
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