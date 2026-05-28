import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Apartamento {
  id: string;
  nombre: string;
  municipio: string;
  provincia: string;
  precioNoche: number;
  estrellas: number;
}

export default function AdminAlojamientos() {
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'ADMIN') {
      navigate('/');
    } else {
      cargarApartamentos();
    }
  }, [navigate]);

  const cargarApartamentos = async () => {
    try {
      setLoading(true);
      // Apunta a tu ruta global de listar todos los apartamentos del backend
      const response = await api.get('/admin/apartamentos'); 
      setApartamentos(response.data);
    } catch (err) {
      console.error('Error cargando apartamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstrellas = async (id: string, estrellas: number) => {
    try {
      // Mandamos la actualización de estrellas directo al ID del inmueble
      await api.patch('/admin/apartamentos/estrellas', { 
        apartamentoId: id,
        estrellas: estrellas
    });
      setApartamentos(prev =>
        prev.map(a => (a.id === id ? { ...a, estrellas } : a))
      );
      alert('Calificación de estrellas actualizada con éxito.');
    } catch (err) {
      alert('No se pudieron asignar las estrellas al alojamiento.');
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-secondary"></div></div>;

  return (
    <div className="container py-2">
      <div className="card shadow-sm p-4 border-0 rounded-3 mb-4 bg-white">
        <h2 className="fw-bold text-dark mb-1">⭐ Auditoría y Calificación de Alojamientos</h2>
        <p className="text-muted mb-0">Inspección de inmuebles turísticos y asignación de categorías oficiales de estrellas para Castilla y León.</p>
      </div>

      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-secondary text-white fw-bold py-3">
          🏠 Inmuebles Registrados en el Sistema Global
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre del Alojamiento</th>
                <th>Ubicación / Municipio</th>
                <th>Provincia</th>
                <th className="text-center" style={{ width: '200px' }}>Categoría Oficial</th>
              </tr>
            </thead>
            <tbody>
              {apartamentos.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4 text-muted">No hay alojamientos dados de alta todavía.</td></tr>
              ) : (
                apartamentos.map(apto => (
                  <tr key={apto.id}>
                    <td><span className="fw-bold text-primary">{apto.nombre}</span></td>
                    <td>📍 {apto.municipio}</td>
                    <td><span className="fw-semibold text-secondary">{apto.provincia}</span></td>
                    <td className="text-center">
                      <select
                        className="form-select form-select-sm fw-bold text-warning border-warning bg-white"
                        value={apto.estrellas}
                        onChange={(e) => handleCambiarEstrellas(apto.id, parseInt(e.target.value, 10))}
                      >
                        {[0, 1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num} className="text-dark fw-normal">
                            {num > 0 ? '⭐'.repeat(num) : '0 estrellas (Sin clasificar)'}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}