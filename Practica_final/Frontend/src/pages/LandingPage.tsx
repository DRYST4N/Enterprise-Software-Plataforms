import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../api/api";
import{ type Festival } from '../types';

const LandingPage = () => {
    const { user } = useAuth();

    const [ festivales, setFestivales] = useState<Festival[]>([]);
    const features = [
        { icon: '🎟️ ', title: 'Entradas al Instante', text: 'Compra tus entradas en menos de un minuto. Sin filas virtuales ni complicaciones.' },
        { icon: '🔒', title: 'Compra Segura', text: 'Pagos 100% protegidos y entradas digitales con códigos QR anti-fraude.' },
        { icon: '🎸', title: 'Los Mejores Eventos', text: 'Desde festivales indie hasta los gigantes de la electrónica. Encuentra tu música.' },
    ];

    const [featIdx, setFeatIdx] = useState(0);

    useEffect(() => {
        api.get('/festivales/disponibles')
        .then(res => setFestivales(res.data.slice(0,3)))
        .catch(()=> {});
    }, []);

    return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
        <header className="bg-dark text-white text-center py-5">
            <div className="container py-5">
                <h1 className="display-3 fw-bold mb-3">Vive la Música, Siente el Festival</h1>
                <p className="lead mb-4">
                    Descubre los mejores festivales, compra tus entradas en segundos y prepárate para experiencias inolvidables.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/festivales" className="btn btn-primary btn-lg px-4">
                        Explorar Festivales
                    </Link>
                    {!user && (
                        <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                            Crear una cuenta
                        </Link>
                    )}
                </div>
            </div>
        </header>

      {/* 2. SECCIÓN DE CARACTERÍSTICAS (FEATURES) */}
        <section className="diagonal-features" style={{
            padding: '100px 0',
        }}>
            <div className="container py-4">
                <div className="d-flex align-items-center justify-content-center gap-4">

                <button
                    onClick={() => setFeatIdx((featIdx - 1 + features.length) % features.length)}
                    style={{ background: 'none', border: '2px solid #212529', borderRadius: '50%', width: '48px', height: '48px', color: '#212529',
                        fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0 }}>
                    ←
                </button>

                <div className="text-center p-5 rounded-4 shadow-lg" style={{
                    background: 'rgba(30, 30, 50, 0.85)',
                    backdropFilter: 'blur(10px)',
                    minWidth: '320px',
                    maxWidth: '460px',
                    color: 'white',
                }}>
                    <div style={{ fontSize: '3rem' }}>{features[featIdx].icon}</div>
                    <h3 className="h4 fw-bold mt-3 mb-2">{features[featIdx].title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.65)' }}>{features[featIdx].text}</p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                        {features.map((_, i) => (
                            <button key={i} onClick={() => setFeatIdx(i)} style={{
                                width: '10px', height: '10px',
                                borderRadius: '50%', border: 'none',
                                background: i === featIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                                cursor: 'pointer', padding: 0,
                            }} />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setFeatIdx((featIdx + 1) % features.length)}
                    style={{ background: 'none', border: '2px solid #212529', borderRadius: '50%', width: '48px', height: '48px', color:
                        '#212529', fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0 }}>
                    →
                </button>

            </div>
        </div>
    </section>

      {/* 3. FESTIVALES DESTACADOS (PREVIEW) */}
        <section className="py-5 diagonal-festivals">
            <div className="container">
                <h2 className="text-center fw-bold mb-5 text-light">Festivales Destacados</h2>
                <div className="row g-4">
            
                    {festivales.map(f => (
                        <div className="col-md-4" key={f.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    {f.imagen_path && (
                                        <img 
                                            src={`http://localhost:3000${f.imagen_path}`}
                                            className="card-img-top"
                                            style={{ height: '180px', objectFit: 'cover' }}
                                            alt={f.nombre}
                                        />
                                    )}
                                    <h5 className="card-title fw-bold">{f.nombre}</h5>
                                    {f.ubicacion && <p className="card-text text-muted small">📍 {f.ubicacion}</p>}
                                    {f.fecha_inicio && <p className="card-text text-muted small">🗓️  {new Date(f.fecha_inicio).toLocaleDateString('es-ES')}</p>}
                                </div>
                                <div className="card-footer bg-white border-0 pb-3">
                                    <Link to="/login" className="btn btn-outline-dark w-100">Ver Detalles</Link>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                <div className="text-center mt-5">
                    <Link to="/festivales" className="btn btn-primary btn-lg">
                        Ver todos los festivales
                    </Link>
                </div>
            </div>
        </section>

      {/* 4. FOOTER */}
        <footer className="bg-dark text-white text-center py-4">
            <div className="container">
                <p className="mb-0">© {new Date().getFullYear()} FestivalApp. Todos los derechos reservados.</p>
                <div className="mt-2">
                    <a href="#" className="text-white-50 text-decoration-none me-3">Términos de Servicio</a>
                    <a href="#" className="text-white-50 text-decoration-none">Política de Privacidad</a>
                </div>
            </div>
        </footer>
    </div>
    );
};

export default LandingPage;