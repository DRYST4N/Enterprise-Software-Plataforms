import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Perfil = () => {
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 1. Estados para la edición
  const [editando, setEditando] = useState(false);
  const [editForm, setEditForm] = useState({ 
    nombre_completo: '', 
    telefono: '',  
    nombre_contacto: '', 
    telefono_contacto: '' 
  });

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const res = await api.get('/auth/mis-datos');
      setDatos(res.data);
    } catch (err) {
      console.error("Error al cargar perfil", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para abrir edición prellenada
  const abrirEdicion = () => {
    setEditForm({
      nombre_completo: datos.nombre_completo || '',
      telefono: datos.telefono || '',
      nombre_contacto: datos.nombre_contacto || '',
      telefono_contacto: datos.telefono_contacto || '',
    });
    setEditando(true);
  };

  // 3. Función para guardar cambios
  const guardarCambios = async () => {
    try {
      await api.patch('/auth/mis-datos', editForm);
      setEditando(false);
      // Recargar datos tras el patch
      const res = await api.get('/auth/mis-datos');
      setDatos(res.data);
    } catch {
      alert('Error al actualizar los datos');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleBorrarCuenta = async () => {
    if (window.confirm("¿Estás seguro? Esta acción borrará todos tus datos permanentemente.")) {
      try {
        await api.delete('/auth/cuenta');
        logout();
        navigate('/login');
      } catch (err) {
        alert("Error al borrar la cuenta");
      }
    }
  };

  if (loading) return <div className="container py-5 text-center">Cargando perfil...</div>;
  if (!datos) return <div className="container py-5">No se encontraron datos.</div>;

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Mi Perfil</h4>
          <span className="badge bg-info text-dark">{datos.usuario?.role}</span>
        </div>
        
        <div className="card-body">
          <h5 className="text-muted small text-uppercase fw-bold">Información de Cuenta</h5>
          <p className="mb-4"><strong>Email:</strong> {datos.usuario?.correo}</p>
          <hr />

          {/* SECCIÓN CLIENTE */}
          {datos.usuario?.role === 'Cliente' && (
            <>
              <h5 className="mb-3">Datos Personales</h5>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre Completo</label>
                {editando ? (
                  <input name="nombre_completo" className="form-control" value={editForm.nombre_completo} onChange={handleInputChange} />
                ) : (
                  <p className="form-control-plaintext border-bottom">{datos.nombre_completo}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">DNI (No editable)</label>
                <p className="form-control-plaintext border-bottom">{datos.dni}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Teléfono</label>
                {editando ? (
                  <input name="telefono" className="form-control" value={editForm.telefono} onChange={handleInputChange} />
                ) : (
                  <p className="form-control-plaintext border-bottom">{datos.telefono || 'No aportado'}</p>
                )}
              </div>

              <p><strong>F. Nacimiento:</strong> {datos.fecha_nacimiento ? new Date(datos.fecha_nacimiento).toLocaleDateString() : 'N/A'}</p>
            </>
          )}

          {/* SECCIÓN EMPRESA */}
          {datos.usuario?.role === 'Empresa' && (
            <>
              <h5 className="mb-3">Datos de Empresa</h5>
              
              <p className="form-control-plaintext border-bottom">{datos.razon_social}</p>
              <p><strong>CIF:</strong> {datos.cif}</p>

              <div className="mb-3">
                <label className="form-label fw-bold">Nombre de Contacto</label>
                {editando ? (
                  <input name="nombre_contacto" className="form-control" value={editForm.nombre_contacto} onChange={handleInputChange} />
                ) : (
                  <p className="form-control-plaintext border-bottom">{datos.nombre_contacto}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Teléfono de Contacto</label>
                {editando ? (
                  <input name="telefono_contacto" className="form-control" value={editForm.telefono_contacto} onChange={handleInputChange} />
                ) : (
                  <p className="form-control-plaintext border-bottom">{datos.telefono_contacto}</p>
                )}
              </div>

              <p><strong>Estado:</strong> <span className={`badge ${datos.estado === 'Verificado' ? 'bg-success' : 'bg-secondary'}`}>{datos.estado}</span></p>
            </>
          )}

          {/* BOTONES DE ACCIÓN */}
          <div className="mt-5 border-top pt-3 d-flex justify-content-between flex-wrap gap-2">
            <div>
              <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)}>Volver</button>
              
              {/* 4. Cambios dinámicos de botones según estado 'editando' */}
              {!editando ? (
                <button className="btn btn-primary" onClick={abrirEdicion}>✏️ Editar Perfil</button>
              ) : (
                <>
                  <button className="btn btn-success me-2" onClick={guardarCambios}>💾 Guardar</button>
                  <button className="btn btn-link text-decoration-none text-muted" onClick={() => setEditando(false)}>Cancelar</button>
                </>
              )}
            </div>

            {!editando && (
              <button className="btn btn-outline-danger" onClick={handleBorrarCuenta}>
                🗑️ Borrar Cuenta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;