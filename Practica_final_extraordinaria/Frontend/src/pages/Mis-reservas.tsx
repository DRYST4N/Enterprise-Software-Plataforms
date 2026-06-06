import { useEffect, useState } from 'react';
import { paymentAPI } from '../services/api';
import QRCode from 'react-qr-code';

interface Reserva {
  id: string;
  checkIn: string;
  checkOut: string;
  totalNoches: number;
  precioTotal: number;
  transactionId: string;
  cardLast4: string;
  cardHolder: string;
  qrValue: string;
  apartamento: { nombre: string; municipio: string; provincia: string };
}

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQrId, setActiveQrId] = useState<string | null>(null); // Controla qué QR se está visualizando

  useEffect(() => {
    cargarHistorialReservas();
  }, []);

  const cargarHistorialReservas = async () => {
    try {
      setLoading(true);
      // 🔥 Atacamos al nuevo endpoint en la API de pagos con el token automático
      const response = await paymentAPI.get('/reservas/mis-reservas');
      setReservas(response.data);
    } catch (err: any) {
      console.error(err);
      setError('No se pudo recuperar tu historial de reservas turísticas.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 border-0 rounded-3 mb-4 bg-white">
        <h2 className="fw-bold text-dark mb-1">📅 Mis Reservas y Localizadores QR</h2>
        <p className="text-muted mb-0">Historial completo de tus estancias contratadas en Castilla y León. Accede a tus llaves digitales de check-in.</p>
      </div>

      {error && <div className="alert alert-danger shadow-sm">⚠️ {error}</div>}

      {reservas.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm py-4">
          Todavía no has realizado ninguna reserva en la plataforma. ¡Explora nuestro catálogo en la Home!
        </div>
      ) : (
        <div className="row">
          {reservas.map((reserva) => (
            <div className="col-12 mb-3" key={reserva.id}>
              <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
                <div className="row align-items-center">
                  {/* DETALLES DE LA ESTANCIA */}
                  <div className="col-md-7">
                    <h4 className="fw-bold text-primary mb-1">🏠 {reserva.apartamento.nombre}</h4>
                    <p className="text-muted small mb-3">📍 {reserva.apartamento.municipio} ({reserva.apartamento.provincia})</p>
                    
                    <div className="row g-2 text-dark small bg-light p-3 rounded">
                      <div className="col-6"><strong>📅 Check-In:</strong> {new Date(reserva.checkIn).toLocaleDateString('es-ES')}</div>
                      <div className="col-6"><strong>📅 Check-Out:</strong> {new Date(reserva.checkOut).toLocaleDateString('es-ES')}</div>
                      <div className="col-6 mt-2"><strong>🌙 Noches:</strong> {reserva.totalNoches} noches</div>
                      <div className="col-6 mt-2"><strong>💶 Importe Total:</strong> <span className="fw-bold text-success">{reserva.precioTotal}€</span></div>
                    </div>
                    <p className="small text-muted mt-2 mb-0">Localizador de pago: <code className="text-secondary">{reserva.transactionId}</code></p>
                  </div>

                  {/* ACCIÓN / VISUALIZADOR QR INDIVIDUAL */}
                  <div className="col-md-5 text-end border-start ps-4 d-flex flex-column align-items-center justify-content-center">
                    {activeQrId === reserva.id ? (
                      <div className="text-center animate__animated animate__fadeIn">
                        <div className="bg-white p-2 border rounded mb-2 shadow-sm">
                          <QRCode value={reserva.qrValue} size={130} viewBox={`0 0 250 250`} />
                        </div>
                        <button 
                          className="btn btn-sm btn-secondary fw-bold rounded-pill px-3"
                          onClick={() => setActiveQrId(null)}
                        >
                          Ocultar QR
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow-sm"
                        onClick={() => setActiveQrId(reserva.id)}
                      >
                        📱 Mostrar QR de Entrada
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}