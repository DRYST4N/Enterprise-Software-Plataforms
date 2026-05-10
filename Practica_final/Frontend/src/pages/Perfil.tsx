import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Perfil = () => {
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchDatos();
  }, []);

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

  if (loading) return <div className="container py-5">Cargando perfil...</div>;
  if (!datos) return <div className="container py-5">No se encontraron datos.</div>;

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Mi Perfil</h4>
          <span className="badge bg-info">{datos.usuario?.role}</span>
        </div>
        <div className="card-body">
          <h5>Información de Cuenta</h5>
          <p><strong>Email:</strong> {datos.usuario?.correo}</p>
          <hr />

          {datos.usuario?.role === 'Cliente' && (
            <>
              <h5>Datos Personales</h5>
              <p><strong>Nombre:</strong> {datos.nombre_completo}</p>
              <p><strong>DNI:</strong> {datos.dni}</p>
              <p><strong>Teléfono:</strong> {datos.telefono || 'No aportado'}</p>
              <p><strong>F. Nacimiento:</strong> {datos.fecha_nacimiento ? new Date(datos.fecha_nacimiento).toLocaleDateString() : 'N/A'}</p>
            </>
          )}

          {datos.usuario?.role === 'Empresa' && (
            <>
              <h5>Datos de Empresa</h5>
              <p><strong>Nombre Comercial:</strong> {datos.nombre_empresa}</p>
              <p><strong>Razón Social:</strong> {datos.razon_social}</p>
              <p><strong>CIF:</strong> {datos.cif}</p>
              <p><strong>Contacto:</strong> {datos.nombre_contacto}</p>
              <p><strong>Teléfono:</strong> {datos.telefono_contacto}</p>
              <p><strong>Estado:</strong> <span className="badge bg-secondary">{datos.estado}</span></p>
            </>
          )}

          <div className="mt-5 border-top pt-3 d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Volver</button>
            <button className="btn btn-danger" onClick={handleBorrarCuenta}>
              🗑️ Borrar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;