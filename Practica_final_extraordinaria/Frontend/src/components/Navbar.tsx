import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Leemos el estado de la sesión directamente del almacenamiento del navegador
  const token = localStorage.getItem('castilla_rooms_token');
  const role = localStorage.getItem('user_role');
  const email = localStorage.getItem('user_email');

  const handleLogout = () => {
    // Limpiamos todo rastro de la sesión
    localStorage.removeItem('castilla_rooms_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    
    alert('Sesión cerrada correctamente.');
    navigate('/login'); // Patada de vuelta al login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm px-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-white" to="/">Castilla.rooms</Link>
        
        <div className="d-flex align-items-center gap-3">
          {/* ENLACES DINÁMICOS SEGÚN EL ROL */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row gap-3">
            <li className="nav-item">
              <Link className="nav-link text-white-50" to="/">Inicio</Link>
            </li>

            {token && role === 'CLIENTE' && (
              <li className="nav-item">
                <Link className="nav-link text-primary fw-semibold" to="/mis-reservas">📅 Mis Reservas (QR)</Link>
              </li>
            )}

            {token && role === 'AGENCIA' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white fw-semibold" to="/agencia/dashboard">Mis Alojamientos</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-info fw-semibold" to="/agencia/informe">📈 Ventas Anuales</Link>
                </li>
              </>
            )}

            {token && role === 'ADMIN' && (
              <>
              <li className="nav-item">
                <Link className="nav-link text-warning fw-semibold" to="/admin/dashboard">🛡️ Panel Verificar Agencias</Link>
              </li>
              <li className='nav-item'>
                <Link className="nav-link text-info fw-semibold" to="/admin/alojamientos"> ⭐ Panel Puntuar Alojamientos</Link>
              </li>
              </>
            )}
          </ul>

          {/* BLOQUE DE CONTROL DE SESIÓN RIGHT-SIDE */}
          <div className="d-flex align-items-center gap-2">
            {token ? (
              <>
                <span className="text-white-50 small d-none d-md-inline">👤 {email} ({role})</span>
                <button onClick={handleLogout} className="btn btn-sm btn-danger fw-bold px-3 shadow-sm">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline-light fw-bold">Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-sm btn-primary fw-bold">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}