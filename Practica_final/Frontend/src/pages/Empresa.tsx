import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { type VentaFestival, type Festival } from '../types';

const Empresa = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [festivales, setFestivales] = useState<Festival[]>([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form festival
  const [festivalForm, setFestivalForm] = useState({
    nombre: '', ubicacion: '', descripcion: '',
    artistas: '', fecha_inicio: '', fecha_fin: '',
    aforo: ''
  });

  // Form entrada
  const [entradaForm, setEntradaForm] = useState({
    nombre: '', precio: '', descripcion: '', festival_id: '',
  });

  const [estadoEmpresa, setEstadoEmpresa] = useState<string | null>(null);
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);

  const [ventas, setVentas] = useState<VentaFestival[]>([]);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: '', ubicacion:'', descripcion: '',
    artistas: '', fecha_inicio: '', fecha_fin: '', aforo: ''
  });

  const abrirEdicion = (f: Festival) => {
    setEditandoId(f.id);
    setEditForm({
      nombre: f.nombre,
      ubicacion: f.ubicacion || '',
      descripcion: f.descripcion || '',
      artistas: (f.artistas || []).join(', '),
      fecha_inicio: f.fecha_inicio ? f.fecha_inicio.split('T')[0] : '',
      fecha_fin: f.fecha_fin ? f.fecha_fin.split('T')[0]: '',
      aforo: ''
    });
  };

  const fetchFestivales = async () => {
    try {
      const res = await api.get('/festivales/mis-festivales');
      const me = await api.get('/auth/mis-datos');
      const venRes = await api.get('/festivales/mis-ventas');
      setFestivales(res.data);
      setEstadoEmpresa(me.data.estado);
      setVentas(venRes.data);
    } catch {
      setError('Error al cargar festivales');
    } finally {
      setLoadingEmpresa(false);
    }
  };

  const cancelarFestival = async (id: number) => {
    if(!window.confirm('¿Seguro que quiere cancelar este festival?')) return;
    try{
      await api.patch(`/festivales/${id}/cancel`);
      setSuccessMsg('Festival cancelado correctamente');
      fetchFestivales();
    }catch(error: any){
      setError(error.response?.data?.message || 'Error al cancelar el festival');
    }
  };

  const guardarEdicion = async (id: number) => {
    try {
      await api.patch(`/festivales/${id}/update`, {
        ...editForm,
        artistas: editForm.artistas.split(',').map(a => a.trim()).filter(Boolean),
        fecha_inicio: editForm.fecha_inicio || undefined,
        fecha_fin: editForm.fecha_fin || undefined,
        aforo: editForm.aforo ? parseInt(editForm.aforo) : undefined,
      });
      setSuccessMsg('Festival actualizado');
      setEditandoId(null);
      fetchFestivales();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al editar el festival');
    }
  };

  useEffect(() => { fetchFestivales(); }, []);

  const handleFestivalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFestivalForm({ ...festivalForm, [e.target.name]: e.target.value });
  };

  const handleEntradaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEntradaForm({ ...entradaForm, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

  const crearFestival = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    try {
      await api.post('/festivales', {
        ...festivalForm,
        artistas: festivalForm.artistas.split(',').map(a => a.trim()).filter(Boolean),
        fecha_inicio: festivalForm.fecha_inicio || undefined,
        fecha_fin: festivalForm.fecha_fin || undefined,
        aforo: parseInt(festivalForm.aforo)
      });
      setSuccessMsg('Festival creado correctamente');
      setFestivalForm({ nombre: '', ubicacion: '', descripcion: '', artistas: '', fecha_inicio: '', fecha_fin: '', aforo: '' });
      fetchFestivales();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear festival');
    }
  };

  const crearEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    try {
      await api.post('/entradas/create', {
        ...entradaForm,
        precio: parseFloat(entradaForm.precio),
        festival_id: parseInt(entradaForm.festival_id),
      });
      setSuccessMsg('Entrada creada correctamente');
      setEntradaForm({ nombre: '', precio: '', descripcion: '', festival_id: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear entrada');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };
  if(loadingEmpresa) return <div>Cargando...</div>;
  if(estadoEmpresa !== 'Verificado') return (
    <div className='container py-5 text-center'>
      <h3>Cuenta pendiente de verificación</h3>
      <p>Un administrador revisará tu empresa en breve.</p>
      {estadoEmpresa === 'Rechazado' && <p className='text-danger'>Tu empresa ha sido rechazada.</p>}
      <button className='btn btn-outline-danger mt-3' onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏢 Panel de Empresa</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="row g-4">
        {/* Crear Festival */}
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">➕ Crear Festival</h5>
            <form onSubmit={crearFestival}>
              <div className="mb-2">
                <input name="nombre" placeholder="Nombre *" className="form-control"
                  value={festivalForm.nombre} onChange={handleFestivalChange} required />
              </div>
              <div className="mb-2">
                <input name="ubicacion" placeholder="Ubicación" className="form-control"
                  value={festivalForm.ubicacion} onChange={handleFestivalChange} />
              </div>
              <div className="mb-2">
                <textarea name="descripcion" placeholder="Descripción" className="form-control"
                  value={festivalForm.descripcion} onChange={handleFestivalChange} />
              </div>
              <div className="mb-2">
                <input name="artistas" placeholder="Artistas (separados por coma)" className="form-control"
                  value={festivalForm.artistas} onChange={handleFestivalChange} />
              </div>
              <div className="mb-2">
                <label className="form-label text-muted small">Fecha inicio</label>
                <input name="fecha_inicio" type="date" className="form-control"
                  value={festivalForm.fecha_inicio} onChange={handleFestivalChange} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Fecha fin</label>
                <input name="fecha_fin" type="date" className="form-control"
                  value={festivalForm.fecha_fin} onChange={handleFestivalChange} />
              </div>
              <div className='"mb-3'>
                <label className='form-label text-muted small'>Aforo</label>
                <input name="aforo" type="number" className='form-control' value={festivalForm.aforo} onChange={handleFestivalChange}/>
              </div>
              <button type="submit" className="btn btn-primary w-100">Crear Festival</button>
            </form>
          </div>
        </div>

        {/* Crear Entrada */}
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">🎟️ Crear Entrada</h5>
            <form onSubmit={crearEntrada}>
              <div className="mb-2">
                <input name="nombre" placeholder="Nombre *" className="form-control"
                  value={entradaForm.nombre} onChange={handleEntradaChange} required />
              </div>
              <div className="mb-2">
                <input name="precio" type="number" placeholder="Precio *" className="form-control"
                  value={entradaForm.precio} onChange={handleEntradaChange} required />
              </div>
              <div className="mb-2">
                <input name="descripcion" placeholder="Descripción *" className="form-control"
                  value={entradaForm.descripcion} onChange={handleEntradaChange} required />
              </div>
              <div className="mb-3">
                <select name="festival_id" className="form-select"
                  value={entradaForm.festival_id} onChange={handleEntradaChange} required>
                  <option value="">Selecciona un festival *</option>
                  {festivales.map(f => (
                    <option key={f.id} value={f.id}>{f.nombre}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-success w-100">Crear Entrada</button>
            </form>
          </div>
        </div>
      </div>

      {/* Lista de festivales */}
        <div className="mt-5">
          <h5>📋 Festivales registrados</h5>
          {festivales.length === 0 && <p className="text-muted">No hay festivales aún.</p>}
          <div className="row g-3 mt-1">
            {festivales.map(f => (
              <div className="col-md-6" key={f.id}> {/* He cambiado a col-md-6 para que el formulario tenga espacio */}
                <div 
                  className={`card shadow-sm p-3 ${
                    f.cancelado === true
                    ? 'boder border-danger bg-light opacity-75'
                    : ''
                  }`}>
                  <div className='d-flex justify-content-between align-items-center mb-1'>
                    <h6 className='mb-0'>{f.nombre}</h6>
                    {f.cancelado && <span className='badge bg-danger'>Cancelado</span>}
                  </div>
                  {f.ubicacion && <p className="text-muted mb-1 small">📍 {f.ubicacion}</p>}
                  {f.fecha_inicio && (
                    <p className="mb-0 small">
                      📅 {new Date(f.fecha_inicio).toLocaleDateString('es-ES')}
                    </p>
                  )}

                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => cancelarFestival(f.id)}
                      disabled = {f.cancelado}
                    >
                      Cancelar festival
                    </button>
                    
                    {/* BOTÓN EDITAR */}
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => abrirEdicion(f)}
                      disabled={f.cancelado}
                    >
                      Editar
                    </button>
                  </div>

                  {/* FORMULARIO DE EDICIÓN CONDICIONAL */}
                  {editandoId === f.id && (
                    <div className="mt-3 p-3 border-top bg-light rounded">
                      <h5 className="fw-bold d-block mb-2">Editando: {f.nombre}</h5>
                      
                      <input 
                        name="nombre" 
                        className="form-control form-control-sm mb-2" 
                        value={editForm.nombre} 
                        onChange={handleEditChange} 
                        placeholder="Nombre"
                      />
                      <input 
                        name="ubicacion" 
                        className="form-control form-control-sm mb-2" 
                        value={editForm.ubicacion} 
                        onChange={handleEditChange} 
                        placeholder="Ubicación"
                      />
                      <textarea 
                        name="descripcion" 
                        className="form-control form-control-sm mb-2" 
                        value={editForm.descripcion} 
                        onChange={handleEditChange} 
                        placeholder="Descripción"
                      />
                      <input 
                        name="artistas" 
                        className="form-control form-control-sm mb-2" 
                        value={editForm.artistas} 
                        onChange={handleEditChange} 
                        placeholder="Artistas (coma, para separar)"
                      />
                      <div className="row g-2 mb-2">
                        <div className="col">
                          <label className="very-small text-muted">Inicio</label>
                          <input name="fecha_inicio" type="date" className="form-control form-control-sm" value={editForm.fecha_inicio} onChange={handleEditChange} />
                        </div>
                        <div className="col">
                          <label className="very-small text-muted">Fin</label>
                          <input name="fecha_fin" type="date" className="form-control form-control-sm" value={editForm.fecha_fin} onChange={handleEditChange} />
                        </div>
                      </div>
                      <input 
                        name="aforo" 
                        type="number" 
                        className="form-control form-control-sm mb-3" 
                        value={editForm.aforo} 
                        onChange={handleEditChange} 
                        placeholder="Aforo"
                      />

                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-success btn-sm w-100" 
                          onClick={() => guardarEdicion(f.id)}
                        >
                          Guardar Cambios
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => setEditandoId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/** Reporte de ventas */}
      <div className='mt-5 mb-5'>
        <h5 className='mb-3'> Reportes de Ventas</h5>
        <div className='card shadow-sm'>
          <div className='table-responsive'>
            <table className='table table-hover mb-0'>
              <thead className='table-dark'>
                <tr>
                  <th>Nombre del festival</th>
                  <th className='text-center'>Entradas Vendidas</th>
                  <th className='text-end'>Total Recaudado</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='text-center py-3 text-muted'>No se han registrado ventas todavía</td>
                  </tr>
                ): (
                  ventas.map((v)=> (
                    <tr key={v.id}>
                      <td className='fw-bold'>{v.nombre}</td>
                      <td className='text-center'>
                        <span className='badge bg-info text-dark'>{v.totalEntradas}</span>
                      </td>
                      <td className='text-end fw-bold text-success'>
                        {Number(v.totalRecaudado).toFixed(2)}€
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
  );
};

export default Empresa;