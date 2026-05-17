import { useEffect, useState } from 'react';
import api from '../api/api';
import { QRCode } from 'react-qr-code';
import { type Compra } from '../types';

const MisCompras = () => {
    const [compras, setCompras] = useState<Compra[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCompras = async () => {
        try {
            const res = await api.get('/payments/mis-compras');
            setCompras(res.data);
        } catch (err) {
            console.error("Error al cargar compras", err);
        } finally {
            setLoading(false);
        }
    };

    const solicitarReembolso = async (id: number) => {
        try {
            await api.post(`/payments/${id}/reembolso`);
            fetchCompras(); // recarga la lista
        } catch (err: any) {
            alert(err.response?.data?.error || 'Error al procesar el reembolso');
        }
    };

    useEffect(() => {
        fetchCompras();
    }, []);

    if (loading) return <div className="container py-5">Cargando tus entradas...</div>;

    return (
    <div className="container py-5">
        <h2 className="mb-4">🎫 Mis Entradas</h2>
        {compras.length === 0 ? (
            <p className="text-muted">Aún no has realizado ninguna compra.</p>
        ) : (
            <div className="row g-4">
            {compras.map((compra) => (
                <div key={compra.id} className="col-12">
                    <div className="card shadow-sm">
                        <div className="row g-0">
                        {/* QR a la izquierda */}
                            <div className="col-md-3 d-flex align-items-center justify-content-center bg-light p-3 border-end">
                                <QRCode value={compra.transaction_id} size={200} />
                            </div>
                            {/* Detalles a la derecha */}
                            <div className="col-md-9">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="card-title mb-1">Transacción: {compra.transaction_id}</h5>
                                            <p className="text-muted small">
                                                📅 {new Date(compra.fecha_compra).toLocaleString('es-ES')}
                                            </p>
                                        </div>
                                        <span className="badge bg-success fs-5">{Number(compra.precio_total).toFixed(2)}€</span>
                                    </div>

                                <div className="mt-3">
                                    <h6>Detalle de entradas:</h6>
                                        <ul className="list-group list-group-flush">
                                            {compra.ticket.map((t, idx) => (
                                            <li key={idx} className="list-group-item px-0 d-flex justify-content-between">
                                                <span>{t.entrada.nombre}</span>
                                                <strong>x{t.cantidad}</strong>
                                                
                                            </li>
                                            ))}
                                        </ul>
                                        {compra.ticket.some(t => t.entrada.festival.cancelado) && !compra.reembolsado && (
                                                <button
                                                    className='btn btn-warning btn-sm mt-3'
                                                    onClick={()=> solicitarReembolso(compra.id)}
                                                    >
                                                        Solicitar reembolso
                                                    </button>
                                        )}
                                        {compra.reembolsado && (
                                            <span className='badge bg-secondary mt-3'>Reembolsado</span>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
        )}
    </div>
    );
};

export default MisCompras;