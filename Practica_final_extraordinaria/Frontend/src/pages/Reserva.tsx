import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import api from '../services/api';
import { encryptCardData } from '../utils/crypto';

export default function Reserva() {
    const { id: apartamentoId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Estados del Formulario de Reserva
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    // Estados de Control Interno
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [qrValue, setQrValue] = useState<string | null>(null);
    const [reservaConfirmada, setReservaConfirmada] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // --- EL ESCUDO CONTRA EL SUSPENSO: ENCRIPTACIÓN EN CALIENTE ---
        // Ciframos los datos de forma simétrica antes de empaquetar el JSON
        const tarjetaCifrada = encryptCardData(cardNumber);
        const cvvCifrado = encryptCardData(cvv);

        const payload = {
        apartamentoId,
        checkIn,
        checkOut,
        cardHolder,
        cardNumber: tarjetaCifrada, // Mandamos el churro "iv:encriptado"
        expiryDate,                 // MM/AA (El backend validará que no esté caducada)
        cvv: cvvCifrado             // Mandamos el churro "iv:encriptado"
        };

        try {
        // Enviamos la petición protegida al backend
        const response = await api.post('/reservas', payload);
        
        // El backend nos devuelve el objeto reserva y el 'qrValue' en texto string optimizado
        setReservaConfirmada(response.data.reserva);
        setQrValue(response.data.qrValue);
        
        alert('¡Pago Aprobado! Reserva procesada correctamente.');
        } catch (err: any) {
        const msg = err.response?.data?.error || 'Error al procesar el pago. Inténtelo de nuevo.';
        setError(msg);
        } finally {
        setLoading(false);
        }
    };

    // Si la reserva ya fue exitosa, mostramos el recibo con su QR Individual
    if (reservaConfirmada && qrValue) {
        return (
        <div className="container d-flex justify-content-center my-5">
            <div className="card shadow border-0 p-4 text-center" style={{ maxWidth: '450px', borderRadius: '12px' }}>
            <h2 className="text-success fw-bold mb-3">🎉 ¡Reserva Confirmada!</h2>
            <p className="text-muted">Guarde su código QR unívoco para el check-in en el apartamento.</p>
            
            <div className="bg-light p-4 rounded my-4 d-flex justify-content-center shadow-sm">
                {/* Pintamos el QR usando la librería oficial exigida */}
                <QRCode value={qrValue} size={200} viewBox={`0 0 250 250`} />
            </div>

            <div className="text-start mb-4 bg-light p-3 rounded">
                <p className="mb-1"><strong>ID de Transacción:</strong> <span className="small text-secondary">{reservaConfirmada.transactionId}</span></p>
                <p className="mb-1"><strong>Titular:</strong> {reservaConfirmada.cardHolder}</p>
                <p className="mb-1"><strong>Tarjeta:</strong> **** **** **** {reservaConfirmada.cardLast4}</p>
                <p className="mb-0"><strong>Total Noches:</strong> {reservaConfirmada.totalNoches} noches</p>
            </div>

            <button onClick={() => navigate('/')} className="btn btn-primary fw-bold w-100 py-2">
                Volver al Catálogo
            </button>
            </div>
        </div>
        );
    }

    return (
        <div className="container d-flex justify-content-center my-4">
        <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '600px', borderRadius: '10px' }}>
            <h3 className="fw-bold mb-1 text-dark">💳 Confirmar Reserva y Pago</h3>
            <p className="text-muted small mb-4">Introduzca las fechas de su estancia y los datos de la tarjeta bancaria de simulación.</p>

            {error && (
            <div className="alert alert-danger py-2 px-3 mb-3 text-center" role="alert" style={{ fontSize: '14px' }}>
                ⚠️ {error}
            </div>
            )}

            <form onSubmit={handleSubmit}>
            {/* SECCIÓN DE FECHAS */}
            <div className="row mb-3">
                <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha de Entrada (Check-In):</label>
                <input type="date" className="form-control" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                </div>
                <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha de Salida (Check-Out):</label>
                <input type="date" className="form-control" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                </div>
            </div>

            <hr className="text-muted my-4" />

            {/* DATOS DE PASARELA BANCARIA */}
            <h5 className="fw-bold mb-3 text-secondary">Información de la Tarjeta</h5>

            <div className="mb-3">
                <label className="form-label fw-semibold">Nombre del Titular:</label>
                <input type="text" className="form-control" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required placeholder="Nombre que figura en la tarjeta" />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Número de Tarjeta:</label>
                <input type="text" className="form-control" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength={16} required placeholder="16 dígitos seguidos (sin espacios)" />
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                <label className="form-label fw-semibold">Caducidad (MM/AA):</label>
                <input type="text" className="form-control" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} maxLength={5} required placeholder="05/29" />
                </div>
                <div className="col-md-6">
                <label className="form-label fw-semibold">CVV:</label>
                <input type="text" className="form-control" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} required placeholder="123" />
                </div>
            </div>

            <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm" disabled={loading}>
                {loading ? 'Procesando transacción bancaria...' : 'Pagar y Generar Reserva'}
            </button>
            </form>
        </div>
        </div>
    );
}