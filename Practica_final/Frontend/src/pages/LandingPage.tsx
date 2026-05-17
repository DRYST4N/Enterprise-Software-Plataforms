import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../api/api";
import{ type Festival } from '../types';

const LandingPage = () => {
    const { user } = useAuth();

    const [ festivales, setFestivales] = useState<Festival[]>([]);

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
        <section className="py-5 bg-light">
            <div className="container text-center">
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="p-4 shadow-sm bg-white rounded h-100">
                            <h3 className="h5 fw-bold text-primary mb-3">🎟️ Entradas al Instante</h3>
                            <p className="text-muted">
                                Compra tus entradas en menos de un minuto. Sin filas virtuales interminables ni complicaciones.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 shadow-sm bg-white rounded h-100">
                            <h3 className="h5 fw-bold text-primary mb-3">🔒 Compra Segura</h3>
                            <p className="text-muted">
                                Pagos 100% protegidos y entradas digitales en tu perfil con códigos QR anti-fraude.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-4 shadow-sm bg-white rounded h-100">
                            <h3 className="h5 fw-bold text-primary mb-3">🎸 Los Mejores Eventos</h3>
                            <p className="text-muted">
                                Desde festivales indie hasta los gigantes de la electrónica. Encuentra la música que te mueve.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      {/* 3. FESTIVALES DESTACADOS (PREVIEW) */}
        <section className="py-5">
            <div className="container">
                <h2 className="text-center fw-bold mb-5">Festivales Destacados</h2>
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