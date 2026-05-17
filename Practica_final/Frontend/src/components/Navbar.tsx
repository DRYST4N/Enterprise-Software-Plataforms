import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  const handleLogout = () => {
    logout();
    closeNav(); // También cerramos el menú al hacer logout en móvil
    navigate("/");
  };

  // ELIMINADO: if (!user) return null; -> Ahora siempre mostramos el Navbar

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">
        Fest.io
      </Link>

      {/* Botón hamburguesa para móviles */}
      <button
        className="navbar-toggler"
        type="button"
        aria-expanded={!isNavCollapsed}
        aria-label="Toggle navigation"
        onClick={handleNavCollapse}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Contenedor de enlaces */}
      <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}>
        <ul className="navbar-nav ms-auto">

          {/* SI EL USUARIO NO ESTÁ AUTENTICADO */}
          {!user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={closeNav}>
                  Log in
                </Link>
              </li>
              <li className="nav-item mt-3 mt-lg-0">
                <Link 
                  className="btn btn-outline-light ms-lg-3 w-100" 
                  to="/registro" 
                  onClick={closeNav}
                >
                  Registrarse
                </Link>
              </li>
            </>
          ) : (
            /* SI EL USUARIO SÍ ESTÁ AUTENTICADO */
            <>
              {/* CLIENTE */}
              {user.role === "Cliente" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/festivales" onClick={closeNav}>
                      Festivales
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/mis-compras" onClick={closeNav}>
                      Mis Entradas
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/me" onClick={closeNav}>
                      Mi Perfil
                    </Link>
                  </li>
                </>
              )}

              {/* EMPRESA */}
              {user.role === "Empresa" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/empresa" onClick={closeNav}>
                      Panel Empresa
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/me" onClick={closeNav}>
                      Mi Perfil
                    </Link>
                  </li>
                </>
              )}

              {/* ADMIN */}
              {user.role === "ADMIN" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin" onClick={closeNav}>
                      Panel Admin
                    </Link>
                  </li>
                </>
              )}

              {/* LOGOUT */}
              <li className="nav-item mt-3 mt-lg-0"> 
                <button
                  className="btn btn-outline-danger ms-lg-3 w-100"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;