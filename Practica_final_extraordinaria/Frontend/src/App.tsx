import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.tsx'; // <-- Importamos tu Navbar real
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Home from './pages/Home.tsx';
import Reserva from './pages/Reserva.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AgenciaDashboard from './pages/AgenciaDashboard.tsx';
import AgenciaInforme from './pages/AgenciaInforme.tsx';
import AdminAlojamientos from './pages/AdminAlojamientos.tsx';


export default function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid min-vh-100 bg-light p-0">
        
        {/* Inyectamos el Navbar Inteligente */}
        <Navbar /> 

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reserva/:id" element={<Reserva />} />
            
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/alojamientos" element={<AdminAlojamientos />} />

            {/* Rutas de Gestión Privadas */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/agencia/dashboard" element={<AgenciaDashboard />} />
            <Route path="/agencia/informe" element={<AgenciaInforme />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
      </div>
    </BrowserRouter>
  );
}