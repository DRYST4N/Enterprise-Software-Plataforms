// src/pages/Register.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { publicAPI } from '../services/api';

export default function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('castilla_rooms_token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const [tipoUsuario, setTipoUsuario] = useState<'CLIENTE' | 'AGENCIA'>('CLIENTE');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');

    const [nombreApellidos, setNombreApellidos] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');

    const [razonSocial, setRazonSocial] = useState('');
    const [cif, setCif] = useState('');
    const [domicilioSocial, setDomicilioSocial] = useState('');
    const [nombreContacto, setNombreContacto] = useState('');

    const [errores, setErrores] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrores([]);
        setLoading(true);

        
        const urlEndpoint = tipoUsuario === 'CLIENTE' ? '/auth/register/client' : '/auth/register/agencia';
        
        const bodyComun = { email, password, telefono };
        const bodyEspecifico = tipoUsuario === 'CLIENTE' 
            ? { nombreApellidos, dni, fechaNacimiento }
            : { razonSocial, cif, domicilioSocial, nombreContacto };

        try {
            await publicAPI.post(urlEndpoint, { ...bodyComun, ...bodyEspecifico });
            alert('¡Registro completado con éxito! Ya puedes iniciar sesión.');
            navigate('/login');
        } catch (err: any) {
            console.error('Error durante el registro:', err);
            
            const backendErrors = err.response?.data?.errors || [err.response?.data?.error || 'Error en el servidor.'];
            setErrores(backendErrors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center my-4">
            <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '550px', borderRadius: '10px' }}>
                <h2 className="text-center fw-bold mb-4">📝 Crear Cuenta</h2>

                {/* Grupo de botones selector de rol */}
                <div className="btn-group w-100 mb-4" role="group">
                    <button
                        type="button"
                        className={`btn py-2 fw-bold ${tipoUsuario === 'CLIENTE' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => { setTipoUsuario('CLIENTE'); setErrores([]); }}
                    >
                        Soy Huésped / Cliente
                    </button>
                    <button
                        type="button"
                        className={`btn py-2 fw-bold ${tipoUsuario === 'AGENCIA' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => { setTipoUsuario('AGENCIA'); setErrores([]); }}
                    >
                        Soy una Agencia
                    </button>
                </div>

                {errores.length > 0 && (
                    <div className="alert alert-danger mb-3" role="alert" style={{ fontSize: '14px' }}>
                        <ul className="mb-0 ps-3">
                            {errores.map((err, idx) => <li key={idx}>{err}</li>)}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* SECCIÓN COMÚN */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email:</label>
                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="correo@ejemplo.com" />
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Contraseña:</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Teléfono:</label>
                            <input type="text" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} required placeholder="600123456" />
                        </div>
                    </div>

                    <hr className="text-muted my-3" />

                    {/* CAMPOS ESPECÍFICOS */}
                    {tipoUsuario === 'CLIENTE' ? (
                        <>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Nombre y Apellidos:</label>
                                <input type="text" className="form-control" value={nombreApellidos} onChange={(e) => setNombreApellidos(e.target.value)} required placeholder="Juan Pérez Gómez" />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">DNI / Pasaporte:</label>
                                    <input type="text" className="form-control" value={dni} onChange={(e) => setDni(e.target.value)} required placeholder="12345678Z" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Fecha de Nacimiento:</label>
                                    <input type="date" className="form-control" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Razón Social:</label>
                                <input type="text" className="form-control" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} required placeholder="Alojamientos CyL S.L." />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">CIF Corporativo:</label>
                                <input type="text" className="form-control" value={cif} onChange={(e) => setCif(e.target.value)} required placeholder="B12345678" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Domicilio Social:</label>
                                <input type="text" className="form-control" value={domicilioSocial} onChange={(e) => setDomicilioSocial(e.target.value)} required placeholder="Calle Mayor 12, Valladolid" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Nombre del Gestor de Contacto:</label>
                                <input type="text" className="form-control" value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)} required placeholder="Carlos Ruiz" />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="btn btn-success w-100 fw-bold py-2 mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Registrar Cuenta'}
                    </button>
                </form>

                <div className="text-center mt-3 small">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none fw-semibold">Inicia sesión aquí</Link>
                </div>
            </div>
        </div>
    );
}