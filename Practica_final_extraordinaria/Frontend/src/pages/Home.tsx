// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import type { Apartamento } from '../types';

export default function Home() {
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [provincia, setProvincia] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargamos los apartamentos reales al arrancar la pantalla
  useEffect(() => {
    fetchApartamentos();
  }, [provincia]); // Se vuelve a ejecutar si el usuario cambia de provincia

  const fetchApartamentos = async () => {
    try {
      setLoading(true);
      // 🔥 CORREGIDO: Ruta limpia adaptada al enrutador modular del backend (/api/apartamentos)
      // Si hay provincia, filtramos mediante Query Params (?provincia=...)
      const url = provincia ? `/apartments?provincia=${provincia}` : '/apartments';
      const response = await publicAPI.get(url);
      setApartamentos(response.data);
    } catch (err) {
      console.error('Error al cargar catálogo público:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* SECCIÓN BUSCADOR / FILTRO */}
      <div className="card p-4 shadow-sm border-0 mb-4 bg-white rounded-3">
        <h3 className="fw-bold mb-3">📍 Descubre tu próximo destino en CyL</h3>
        <div className="row g-3">
          <div className="col-md-8">
            <select 
              className="form-select form-select-lg"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
            >
              <option value="">Todas las provincias de Castilla y León</option>
              {['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-lg btn-primary w-100 fw-bold shadow-sm" onClick={fetchApartamentos}>
              🔄 Actualizar Catálogo
            </button>
          </div>
        </div>
      </div>

      {/* RENDERIZADO DE APARTAMENTOS */}
      {loading ? (
        <div className="text-center my-5"><div className="spinner-border text-primary"></div></div>
      ) : apartamentos.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm">
          No hay apartamentos disponibles con los criterios seleccionados en este momento.
        </div>
      ) : (
        <div className="row g-4">
          {apartamentos.map(apto => (
            <div className="col-md-4" key={apto.id}>
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden custom-card">
                <div className="bg-secondary text-white text-center py-5 position-relative" style={{ minHeight: '160px' }}>
                  <span className="position-absolute top-0 start-0 m-2 badge bg-dark opacity-75">🏢 {apto.provincia}</span>
                  <span className="fs-1">🏠</span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark">{apto.nombre}</h5>
                  <p className="card-text text-muted small text-truncate-2 mb-2">{apto.descripcion}</p>
                  <p className="mb-2 text-warning fw-bold">
                    {apto.estrellas > 0 ? '⭐'.repeat(apto.estrellas) : '0 estrellas (Sin clasificar)'}
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                    <div>
                      <span className="fs-4 fw-bold text-success">{apto.precioNoche}€</span>
                      <span className="text-muted small"> / noche</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/reserva/${apto.id}`)}
                      className="btn btn-sm btn-outline-primary fw-bold px-3 rounded-pill"
                    >
                      Reservar -{`>`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}