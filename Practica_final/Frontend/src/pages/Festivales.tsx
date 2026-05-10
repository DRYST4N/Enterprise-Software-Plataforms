import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Festival } from '../types';

const Festivales = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [festivales, setFestivales] = useState<Festival[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFestivales = async () => {
            try{
                const res = await api.get('/festivales/disponibles');
                setFestivales(res.data);
            }catch{
                setError("Error al cargar festivales");
            }
        };
        fetchFestivales();
    }, []);
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return(<div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎪 Festivales disponibles</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
        <button className="btn" onClick={() => navigate('/me')}>Perfil</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {festivales.length === 0 && !error && (
        <p className="text-muted">No hay festivales disponibles.</p>
      )}

      <div className="row g-4">
        {festivales.map((festival) => (
          <div className="col-md-4" key={festival.id}>
            <div className="card h-100 shadow-sm">
              {festival.imagen_path && (
                <img
                  src={festival.imagen_path}
                  className="card-img-top"
                  alt={festival.nombre}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{festival.nombre}</h5>
                {festival.ubicacion && (
                  <p className="text-muted mb-1">📍 {festival.ubicacion}</p>
                )}
                {festival.descripcion && (
                  <p className="card-text">{festival.descripcion}</p>
                )}
                {festival.artistas && festival.artistas.length > 0 && (
                  <p className="mb-1">
                    🎤 <strong>Artistas:</strong> {festival.artistas.join(', ')}
                  </p>
                )}
                {festival.fecha_inicio && (
                  <p className="mb-0 text-secondary">
                    📅 {new Date(festival.fecha_inicio).toLocaleDateString('es-ES')}
                    {festival.fecha_fin && ` → ${new Date(festival.fecha_fin).toLocaleDateString('es-ES')}`}
                  </p>
                )}
                <div className="mt-auto pt-3">
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={() => navigate(`/checkout/${festival.id}`)}
                  >
                    🎟️ Comprar entradas
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Festivales;