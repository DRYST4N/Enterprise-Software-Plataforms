import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Listado oficial de provincias para el filtro (Requisito del enunciado)
const PROVINCIAS_CYL = [
    'Todas', 'Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 
    'Segovia', 'Soria', 'Valladolid', 'Zamora'
];

    // Datos ficticios iniciales para pintar la pantalla de inmediato
const APARTAMENTOS_MOCK = [
    { id: '1', nombre: 'Ático Plaza Mayor', municipio: 'Valladolid', provincia: 'Valladolid', precioNoche: 85, estrellas: 4, descripcion: 'Precioso ático en el corazón de la ciudad.' },
    { id: '2', nombre: 'Casa Rural Silos', municipio: 'Santo Domingo de Silos', provincia: 'Burgos', precioNoche: 120, estrellas: 5, descripcion: 'Desconexión total con jardín y barbacoa.' },
    { id: '3', nombre: 'Apartamento Catedral', municipio: 'León', provincia: 'León', precioNoche: 65, estrellas: 3, descripcion: 'Vistas espectaculares a la catedral.' },
];

export default function Home() {
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('Todas');
    const navigate = useNavigate();

    // Filtrado en tiempo real en el cliente
    const apartamentosFiltrados = provinciaSeleccionada === 'Todas'
        ? APARTAMENTOS_MOCK
        : APARTAMENTOS_MOCK.filter(apto => apto.provincia === provinciaSeleccionada);

    const handleReservar = (aptoId: string) => {
        const token = localStorage.getItem('castilla_rooms_token');
        const role = localStorage.getItem('user_role');

        if (!token) {
        alert('Debes iniciar sesión para realizar una reserva.');
        navigate('/login');
        return;
        }

        if (role !== 'CLIENTE') {
        alert('Solo los usuarios con cuenta de Cliente pueden reservar alojamientos.');
        return;
        }

        // Si es cliente real y está logueado, pasamos a la pasarela de reservas
        navigate(`/reserva/${aptoId}`);
    };

return (
    <div className="container py-2">
        <div className="row my-4 align-items-center">
            <div className="col-md-8">
                <h2 className="fw-bold text-dark m-0">Explore alojamientos en Castilla y León</h2>
                <p className="text-muted mb-0">Encuentra estancias verificadas gestionadas por agencias locales.</p>
            </div>
            
            {/* Filtro por Provincia Obligatorio */}
            <div className="col-md-4 mt-3 mt-md-0">
                <label className="form-label fw-semibold text-secondary">Filtrar por provincia:</label>
                <select 
                    className="form-select shadow-sm"
                    value={provinciaSeleccionada}
                    onChange={(e) => setProvinciaSeleccionada(e.target.value)}
                >
                    {PROVINCIAS_CYL.map(prov => <option key={prov} value={prov}>{prov}</option>)}
                </select>
            </div>
        </div>

        {/* Grid de Apartamentos */}
        <div className="row">
            {apartamentosFiltrados.length === 0 ? (
                <div className="col-12 text-center my-5">
                    <p className="text-muted fs-5">No hay apartamentos disponibles en la provincia de {provinciaSeleccionada} en este momento.</p>
                </div>
                ) : (
                apartamentosFiltrados.map((apto) => (
                    <div className="col-md-4 mb-4" key={apto.id}>
                        <div className="card h-100 shadow-sm border-0 position-relative">
                    
                        {/* Badge de Provincia */}
                            <span className="position-absolute top-0 end-0 bg-primary text-white px-3 py-1 m-3 rounded-pill fw-bold small shadow-sm">
                                {apto.provincia}
                            </span>

                            <div className="card-body d-flex flex-column pt-5">
                                <h5 className="card-title fw-bold text-dark mb-1">{apto.nombre}</h5>
                                <p className="text-muted small mb-2">📍 {apto.municipio}</p>
                    
                                {/* Estrellas otorgadas por el Admin */}
                                <div className="mb-3 text-warning">
                                    {'⭐'.repeat(apto.estrellas)}
                                    <span className="text-muted small ms-1">({apto.estrellas} estrellas)</span>
                                </div>

                                <p className="card-text text-secondary flex-grow-1 fs-6">{apto.descripcion}</p>
                    
                                <hr className="text-muted my-3" />

                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                    <div>
                                        <span className="fs-4 fw-extrabold text-success">{apto.precioNoche}€</span>
                                        <span className="text-muted small"> / noche</span>
                                    </div>
                                    <button 
                                        onClick={() => handleReservar(apto.id)}
                                        className="btn btn-outline-primary fw-bold px-3 shadow-sm"
                                    >
                                        Reservar
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
}