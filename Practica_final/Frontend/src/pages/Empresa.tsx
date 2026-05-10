import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import type { Festival } from '../types';

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

  const fetchFestivales = async () => {
    try {
      const res = await api.get('/festivales/mis-festivales');
      setFestivales(res.data);
    } catch {
      setError('Error al cargar festivales');
    }
  };

  useEffect(() => { fetchFestivales(); }, []);

  const handleFestivalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFestivalForm({ ...festivalForm, [e.target.name]: e.target.value });
  };

  const handleEntradaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEntradaForm({ ...entradaForm, [e.target.name]: e.target.value });
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
        aforo: festivalForm.aforo
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏢 Panel de Empresa</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
        <button className='btn' onClick={()=> navigate('/me')}>Perfil</button>
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
            <div className="col-md-4" key={f.id}>
              <div className="card shadow-sm p-3">
                <h6>{f.nombre}</h6>
                {f.ubicacion && <p className="text-muted mb-1 small">📍 {f.ubicacion}</p>}
                {f.fecha_inicio && (
                  <p className="mb-0 small">
                    📅 {new Date(f.fecha_inicio).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Empresa;