import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Requisito del enunciado: Control estricto de provincias de CyL
const PROVINCIAS_CYL = [
  'Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 
  'Segovia', 'Soria', 'Valladolid', 'Zamora'
];

interface Apartamento {
  id: string;
  nombre: string;
  municipio: string;
  provincia: string;
  precioNoche: number;
  estrellas: number;
}

export default function AgenciaDashboard() {
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Estados del formulario para nuevo apartamento
  const [nombre, setNombre] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [provincia, setProvincia] = useState(PROVINCIAS_CYL[0]); // Por defecto Ávila
  const [precioNoche, setPrecioNoche] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // 1. Protección de Rol en Cliente
  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'AGENCIA') {
      alert('Acceso denegado. Zona exclusiva para Agencias Verificadas.');
      navigate('/');
    } 

    const verificarEstadoReal = async () => {
      try{
        setLoading(true);

        const response = await api.get('/apartamento/mis-apartamentos');
        setApartamentos(response.data);
      }catch(err: any){
        if (err.response?.status === 403){
          setError('Tu agencia esta registrada, pero aún requiere la aprobacion del Administrador.');
        }else{
          setError('No se pudieron recuperar tus alojamientos en este momentos.');
        }
      }finally{
        setLoading(false);
      }
    };

    verificarEstadoReal();
  }, [navigate]);

  // 2. Recuperar alojamientos de la propia agencia
  const cargarMisApartamentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/apartamento/mis-apartamentos');
      setApartamentos(response.data);
    } catch (err: any) {
      setError('No se pudieron recuperar tus alojamientos. Revisa que tu agencia esté aprobada por el Admin.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Enviar el alta del nuevo apartamento
  const handleCrearApartamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      nombre,
      municipio,
      provincia,
      precioNoche: Number(precioNoche),
      descripcion
    };

    try {
      await api.post('/apartamento', payload);
      alert('¡Apartamento registrado con éxito en Castilla y León!');
      
      // Limpiamos el formulario
      setNombre('');
      setMunicipio('');
      setPrecioNoche('');
      setDescripcion('');
      
      // Recargamos la lista
      cargarMisApartamentos();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al guardar el apartamento.');
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container py-2">
      {/* CABECERA */}
      <div className="card shadow-sm p-4 border-0 rounded-3 mb-4 bg-white">
        <h2 className="fw-bold text-dark mb-1">💼 Panel de Gestión de la Agencia</h2>
        <p className="text-muted mb-0">Da de alta nuevos inmuebles turísticos y revisa la calificación otorgada por la delegación.</p>
      </div>

      {error && <div className="alert alert-danger mb-4 shadow-sm">⚠️ {error}</div>}

      <div className="row">
        {/* COLUMNA 1: FORMULARIO DE ALTA */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
            <h4 className="fw-bold mb-3 text-secondary border-bottom pb-2">➕ Registrar Inmueble</h4>
            <form onSubmit={handleCrearApartamento}>
              
              <div className="mb-3">
                <label className="form-label fw-semibold small">Nombre Comercial:</label>
                <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej: Villa Mudéjar" />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Municipio / Pueblo:</label>
                <input type="text" className="form-control" value={municipio} onChange={(e) => setMunicipio(e.target.value)} required placeholder="Ej: Olmedo" />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Provincia (CyL):</label>
                <select className="form-select" value={provincia} onChange={(e) => setProvincia(e.target.value)}>
                  {PROVINCIAS_CYL.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Precio por Noche (€):</label>
                <input type="number" className="form-control" value={precioNoche} onChange={(e) => setPrecioNoche(e.target.value)} required placeholder="75" min={1} />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Descripción del Inmueble:</label>
                <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={3} placeholder="Detalles de habitaciones, servicios..." />
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
                Publicar Apartamento
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA 2: TABLA DE MIS ALOJAMIENTOS */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            <div className="card-header bg-dark text-white fw-bold py-3">
              🏠 Tus Alojamientos en el Catálogo
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Ubicación</th>
                    <th className="text-center">Precio / Noche</th>
                    <th className="text-center">Calificación Oficial</th>
                  </tr>
                </thead>
                <tbody>
                  {apartamentos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-5 text-muted">
                        No has registrado ningún apartamento todavía. Usa el formulario lateral.
                      </td>
                    </tr>
                  ) : (
                    apartamentos.map((apto) => (
                      <tr key={apto.id}>
                        <td><strong className="text-primary">{apto.nombre}</strong></td>
                        <td>📍 {apto.municipio} (<span className="fw-semibold text-secondary">{apto.provincia}</span>)</td>
                        <td className="text-center fw-bold text-success">{apto.precioNoche}€</td>
                        <td className="text-center text-warning fw-bold">
                          {apto.estrellas > 0 ? '⭐'.repeat(apto.estrellas) : '⏳ Pendiente Auditoría'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}