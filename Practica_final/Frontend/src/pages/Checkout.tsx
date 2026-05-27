import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Festival } from '../types';
import QRCode from 'react-qr-code';

const Checkout = () => {
    const { id } = useParams<{ id: string }>();
    const navigate  =useNavigate();

    // --- ESTADOS ---
    const [festival, setFestival] = useState<Festival | null>(null);
    const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
    const [cardForm, setCardForm] = useState({
        cardHolder: '',
        cardNumber: '',
        expirateDate: '',
        cvv: ''
    });
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagando, setPagando] = useState(false);

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const fetchFestival = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/festivales/${id}`);
                setFestival(res.data.festival);
                const initial: { [key: number]: number } = {};
                res.data.festival.entrada.forEach((ent: any) => { initial[ent.id] = 0; });
                setCantidades(initial);
            } catch (err) {
                setError('Error al cargar la información del festival');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchFestival();
    }, [id]);

    // --- MANEJADORES ---
    const handleCantidadChange = (entradaId: number, valor: number) => {
        setCantidades(prev => ({ ...prev, [entradaId]: Math.max(0, valor) }));
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardForm(prev => ({ ...prev, [name]: value }));
    };

    // CALCULO DE TOTAL (para mostrar en el botón)
    const totalPagar = festival?.entrada?.reduce((acc, ent) => {
        return acc + (cantidades[ent.id] * Number(ent.precio));
    }, 0) || 0;

    // --- FUNCIÓN DE PAGO ---
    const handlePago = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Transformar el objeto cantidades en el array items que pide el backend
        const items = Object.entries(cantidades)
            .filter(([_, cantidad]) => cantidad > 0) // Solo las que tienen cantidad > 0
            .map(([entrada_id, cantidad]) => ({
                entrada_id: Number(entrada_id),
                cantidad: cantidad
            }));

        if (items.length === 0) {
            setError('Selecciona al menos una entrada para continuar.');
            return;
        }

        try {
            setPagando(true);
            const res = await api.post('/payments', {
                items,
                ...cardForm,
                precio_total: totalPagar,
                card_last4: cardForm.cardNumber.slice(-4)
            });

            // Guardar el transaction_id según la estructura de tu respuesta
            setTransactionId(res.data.data.checkout.transaction_id);
            setTimeout(()=> navigate('/mis-compras'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar el pago');
        } finally {
            setPagando(false);
        }
    };

    // --- VISTA DE ÉXITO (QR) ---
    if (transactionId) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow p-5 mx-auto" style={{ maxWidth: '450px' }}>
                    <h2 className="text-success mb-3">¡Pago Exitoso!</h2>
                    <p>Muestra este código en la entrada:</p>
                    <div className="bg-light p-3 border rounded mb-3">
                        <QRCode value={transactionId} size={200} />
                    </div>
                    <code className="d-block mb-4 text-muted">{transactionId}</code>
                    <button className="btn btn-outline-primary" onClick={() => navigate('/festivales')}>
                        Volver a Festivales
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return <div className="container py-5">Cargando festival...</div>;

    return (
        <div className="container py-5">
            <h2 className="mb-4">Checkout: {festival?.nombre}</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {/* LISTADO DE ENTRADAS */}
                <div className="col-md-7">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white"><h5>1. Selecciona entradas</h5></div>
                        <div className="card-body">
                            {festival?.entrada?.map((ent: any) => (
                                <div key={ent.id} className="d-flex justify-content-between align-items-center mb-3 p-2 border-bottom">
                                    <div>
                                        <h6 className="mb-0">{ent.nombre}</h6>
                                        <span className="text-success fw-bold">{Number(ent.precio)}€</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        style={{ width: '80px' }}
                                        value={cantidades[ent.id] || 0}
                                        onChange={(e) => handleCantidadChange(ent.id, parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FORMULARIO DE TARJETA */}
                <div className="col-md-5">
                    <div className="card shadow-sm border-primary">
                        <div className="card-header bg-primary text-white"><h5>2. Datos de Pago</h5></div>
                        <div className="card-body">
                            <form onSubmit={handlePago}>
                                <div className="mb-3">
                                    <label className="form-label">Titular de la tarjeta</label>
                                    <input type="text" name="cardHolder" className="form-control" required 
                                            onChange={handleCardChange} value={cardForm.cardHolder} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Número de tarjeta</label>
                                    <input type="text" name="cardNumber" className="form-control" maxLength={16} required 
                                            onChange={handleCardChange} value={cardForm.cardNumber} />
                                </div>
                                <div className="row">
                                    <div className="col-7 mb-3">
                                        <label className="form-label">Expiración (MM/YY)</label>
                                        <input type="text" name="expirateDate" className="form-control" placeholder="MM/YY" required 
                                                onChange={handleCardChange} value={cardForm.expirateDate} />
                                    </div>
                                    <div className="col-5 mb-3">
                                        <label className="form-label">CVV</label>
                                        <input type="text" name="cvv" className="form-control" maxLength={3} required 
                                                onChange={handleCardChange} value={cardForm.cvv} />
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between h4 mb-4">
                                    <span>Total:</span>
                                    <span>{totalPagar.toFixed(2)}€</span>
                                </div>
                                <button type="submit" className="btn btn-success btn-lg w-100" disabled={pagando || totalPagar === 0}>
                                    {pagando ? 'Procesando...' : `Pagar ${totalPagar.toFixed(2)}€`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;