import { useEffect, useState } from 'react';
import api from '../api/api';

interface EmpresaAdmin {
  id: number;
  razon_social: string;
  cif: string;
  estado: 'Espera' | 'Verificado' | 'Rechazado';
  usuario: {
    correo: string;
  };
}

const Admin = () => {
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Cargar lista de empresas
  const fetchEmpresas = async () => {
    try {
      const res = await api.get('/admin/empresas');
      setEmpresas(res.data);
    } catch (err) {
      setError('Error al obtener la lista de empresas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  // 3 y 4. Manejar acciones de verificación/rechazo
  const handleAccion = async (id: number, accion: 'verificar' | 'rechazar') => {
    try {
      await api.patch(`/admin/empresas/${id}/${accion}`);
      // 6. Recargar la lista tras el éxito
      fetchEmpresas();
    } catch (err) {
      alert(`Error al ${accion} la empresa`);
    }
  };

  // Función auxiliar para colores de badges
  const getBadgeClass = (estado: string) => {
    switch (estado) {
      case 'Verificado': return 'bg-success';
      case 'Rechazado': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  };

  if (loading) return <div className="container py-5 text-center">Cargando panel de control...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛠️ Panel de Administración</h2>
        <span className="badge bg-secondary">{empresas.length} empresas registradas</span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre / Razón Social</th>
                <th>CIF</th>
                <th>Correo</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="fw-bold">{emp.razon_social}</div>
                  </td>
                  <td><code>{emp.cif}</code></td>
                  <td>{emp.usuario.correo}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(emp.estado)}`}>
                      {emp.estado}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-success"
                        // 5. Desactivado si no está en espera
                        disabled={emp.estado !== 'Espera'}
                        onClick={() => handleAccion(emp.id, 'verificar')}
                      >
                        ✓ Verificar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        // 5. Desactivado si no está en espera
                        disabled={emp.estado !== 'Espera'}
                        onClick={() => handleAccion(emp.id, 'rechazar')}
                      >
                        ✕ Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {empresas.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No hay empresas para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;