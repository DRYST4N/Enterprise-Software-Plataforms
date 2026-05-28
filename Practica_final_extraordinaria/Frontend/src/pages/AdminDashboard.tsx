import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Agencia } from '../types';


export default function AdminDashboard() {
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'ADMIN') {
      navigate('/');
    } else {
      cargarAgencias();
    }
  }, [navigate]);

  const cargarAgencias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/agencias');
      setAgencias(response.data);
    } catch (err) {
      console.error('Error cargando agencias:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarStatus = async (id: string, nuevoStatus: 'APPROVED' | 'REJECTED') => {
    const payload = {
      verificada: nuevoStatus === 'APPROVED',
      bloqueada: nuevoStatus === 'REJECTED'
    };

    try {
      await api.patch(`/admin/agencias/${id}/status`, payload);
      setAgencias(prev =>
        prev.map(a => (a.id === id ? { ...a, ...payload } : a))
      );
      alert('Licencia de la agencia actualizada correctamente.');
    } catch (err) {
      alert('Error al actualizar el estado.');
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-2">
      <div className="card shadow-sm p-4 border-0 rounded-3 mb-4 bg-white">
        <h2 className="fw-bold text-dark mb-1">🛡️ Panel de Control de Administración</h2>
        <p className="text-muted mb-0">Gestión de licencias corporativas y verificación jurídica de agencias turísticas.</p>
      </div>

      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-dark text-white fw-bold py-3">
          📋 Agencias Registradas en el Sistema
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Razón Social</th>
                <th>CIF</th>
                <th>Persona de Contacto</th>
                <th className="text-center">Estado Oficial</th>
                <th className="text-end px-4">Acciones de Verificación</th>
              </tr>
            </thead>
            <tbody>
              {agencias.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4 text-muted">No hay agencias dadas de alta todavía.</td></tr>
              ) : (
                agencias.map(agencia => (
                  <tr key={agencia.id}>
                    <td><strong>{agencia.razonSocial}</strong></td>
                    <td><code>{agencia.cif}</code></td>
                    <td>{agencia.nombreContacto}</td>
                    <td className="text-center">
                      {agencia.verificada ? (
                        <span className="badge px-3 py-2 bg-success-subtle text-success rounded-pill fw-bold">✅ VERIFICADA</span>
                      ) : Math.max(0, Number(agencia.bloqueada)) ? (
                        <span className="badge px-3 py-2 bg-danger-subtle text-danger rounded-pill fw-bold">❌ BLOQUEADA</span>
                      ) : (
                        <span className="badge px-3 py-2 bg-warning-subtle text-warning rounded-pill fw-bold">⏳ PENDIENTE</span>
                      )}
                    </td>
                    <td className="text-end px-4">
                      <div className="btn-group gap-2">
                        {!agencia.verificada && (
                          <button onClick={() => handleCambiarStatus(agencia.id, 'APPROVED')} className="btn btn-sm btn-success fw-bold px-3 shadow-sm">Verificar</button>
                        )}
                        {!agencia.bloqueada && (
                          <button onClick={() => handleCambiarStatus(agencia.id, 'REJECTED')} className="btn btn-sm btn-outline-danger fw-bold px-3 shadow-sm">Bloquear</button>
                        )}
                      </div>
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