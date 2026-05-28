import React, { useState } from 'react';
import api from '../services/api';
import type { DatosInforme } from '../types';


export default function AgenciaInforme() {
  // Inicializamos el año con el año actual en curso (2026)
  const [anio, setAnio] = useState<string>('2026');
  const [informe, setInforme] = useState<DatosInforme | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerarInforme = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInforme(null);
    
    const anioNum = parseInt(anio, 10);
    if (isNaN(anioNum) || anioNum < 2000 || anioNum > 2100) {
      setError('Por favor, introduce un año válido (ej: 2026).');
      return;
    }

    try {
      setLoading(true);
      // Consumimos tu endpoint analítico del backend enviando el año por Query Params
      const response = await api.get(`/apartamento/informe-ventas?anio=${anioNum}`);
      
      // Mapeamos la respuesta (Asegúrate de que tu backend devuelve estas propiedades)
      setInforme({
        anio: anioNum,
        totalIngresos: response.data.totalIngresos || 0,
        totalReservas: response.data.totalReservas || 0,
      });
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        'Error al calcular el balance analítico. Asegúrate de tener reservas completadas en este año.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-2">
      {/* CABECERA */}
      <div className="card shadow-sm p-4 border-0 rounded-3 mb-4 bg-white">
        <h2 className="fw-bold text-dark mb-1">📈 Informe Analítico de Ventas Anuales</h2>
        <p className="text-muted mb-0">Introduce el año fiscal para auditar la facturación agregada y el volumen de reservas de la agencia.</p>
      </div>

      {/* FORMULARIO DE FILTRO */}
      <div className="card shadow-sm border-0 p-4 rounded-3 bg-white mb-4">
        <form onSubmit={handleGenerarInforme} className="row align-items-end g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold text-secondary small">Año Fiscal a Consultar:</label>
            <input
              type="number"
              className="form-control form-control-lg fw-bold"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              placeholder="Ej: 2026"
              min="2000"
              max="2100"
              required
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-lg btn-info text-white fw-bold w-100 shadow-sm py-2">
              {loading ? 'Calculando...' : '🔍 Generar Balance'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger shadow-sm">⚠️ {error}</div>}

      {/* RESULTADOS / TARJETAS METRICAS */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-info" role="status"></div>
          <p className="text-muted mt-2">Procesando agregaciones en la base de datos de Castilla y León...</p>
        </div>
      )}

      {informe && (
        <div className="row g-4 animate__animated animate__fadeIn">
          {/* TARJETA 1: TOTAL INGRESOS */}
          <div className="col-md-6">
            <div className="card border-0 rounded-3 shadow-sm bg-success text-white p-4 position-relative overflow-hidden">
              <div className="position-absolute end-0 bottom-0 opacity-25" style={{ fontSize: '6rem', transform: 'translate(10px, 20px)' }}>
                💶
              </div>
              <h5 className="fw-semibold text-uppercase small opacity-75 mb-2">Facturación Bruta Anual ({informe.anio})</h5>
              <h1 className="display-4 fw-bold mb-0">
                {informe.totalIngresos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </h1>
              <p className="small mb-0 mt-2 opacity-75">Dinero líquido total percibido por pernoctaciones.</p>
            </div>
          </div>

          {/* TARJETA 2: TOTAL RESERVAS */}
          <div className="col-md-6">
            <div className="card border-0 rounded-3 shadow-sm bg-primary text-white p-4 position-relative overflow-hidden">
              <div className="position-absolute end-0 bottom-0 opacity-25" style={{ fontSize: '6rem', transform: 'translate(10px, 20px)' }}>
                📅
              </div>
              <h5 className="fw-semibold text-uppercase small opacity-75 mb-2">Volumen de Ocupación ({informe.anio})</h5>
              <h1 className="display-4 fw-bold mb-0">
                {informe.totalReservas} <span className="fs-3 fw-normal">reservas</span>
              </h1>
              <p className="small mb-0 mt-2 opacity-75">Contratos de reserva formalizados por huéspedes en el sistema.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}