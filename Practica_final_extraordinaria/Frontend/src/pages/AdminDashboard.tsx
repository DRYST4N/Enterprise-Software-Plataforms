// src/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import type { Agencia } from '../types';
import type { SystemStatus } from '../types';

export default function AdminDashboard() {
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'ADMIN') {
      navigate('/');
    } else {
      inicializarPanel();
    }
  }, [navigate]);

  const inicializarPanel = async () => {
    try {
      setLoading(true);
      
      const [agenciasRes, statusRes] = await Promise.all([
        adminAPI.get('/admin/agencias'),
        adminAPI.get('/admin/system/status')
      ]);
      
      setAgencias(agenciasRes.data);
      setSystemStatus(statusRes.data);
    } catch (err) {
      console.error('Error al inicializar el panel de administración:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarStatus = async (id: string, nuevoStatus: 'APPROVED' | 'REJECTED') => {
    const esVerificación = nuevoStatus === 'APPROVED';
    
    try {
      // Mapeado al endpoint real del backend del Admin (Puerto 4000)
      // /api/admin/verify-agency/:agenciaId
      await adminAPI.put(`/admin/verify-agency/${id}`, {
        verificar: esVerificación
      });

      // Actualizamos el estado de la interfaz de forma reactiva
      setAgencias(prev =>
        prev.map(a => (a.id === id ? { 
          ...a, 
          verificada: esVerificación, 
          bloqueada: !esVerificación 
        } : a))
      );
      
      alert('Estado de la agencia y licencia corporativa actualizados correctamente.');
    } catch (err) {
      console.error('Error actualizando el estado de la agencia:', err);
      alert('No se pudo modificar el estado de la agencia.');
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-2">
      {/* CARD BIENVENIDA */}
      <div className="card shadow-sm p-4 border-0 rounded-3 mb-4 bg-white">
        <h2 className="fw-bold text-dark mb-1">🛡️ Panel de Control de Administración</h2>
        <p className="text-muted mb-0">Gestión de licencias corporativas y verificación jurídica de agencias turísticas.</p>
      </div>

      {/* SEMÁFORO DE SALUD DE LOS SERVICIOS DISTRIBUIDOS */}
      {systemStatus && (
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 p-3 h-100 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-1 fw-bold">{systemStatus.apiPublica.name}</h6>
                  <small className="text-secondary">{systemStatus.apiPublica.message}</small>
                </div>
                <span className={`badge px-3 py-2 rounded-pill fw-bold ${
                  systemStatus.apiPublica.status === 'ONLINE' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                }`}>
                  ● {systemStatus.apiPublica.status}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm border-0 p-3 h-100 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-1 fw-bold">{systemStatus.apiPagos.name}</h6>
                  <small className="text-secondary">{systemStatus.apiPagos.message}</small>
                </div>
                <span className={`badge px-3 py-2 rounded-pill fw-bold ${
                  systemStatus.apiPagos.status === 'ONLINE' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                }`}>
                  ● {systemStatus.apiPagos.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLA DE AGENCIAS */}
      <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-dark text-white fw-bold py-3">
          📋 Agencias Registradas en el Sistema Maestro
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
                      ) : agencia.bloqueada ? (
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