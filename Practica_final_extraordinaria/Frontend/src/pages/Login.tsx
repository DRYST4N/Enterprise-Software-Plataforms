import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('castilla_rooms_token');
        if(token){
            navigate('/');
        }
    }, [navigate]);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('castilla_rooms_token', token);
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user_email', user.email);

        if (user.role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else if (user.role === 'AGENCIA') {
            navigate('/agencia/dashboard');
        } else {
            navigate('/');
        }
        } catch (err: any) {
        const msg = err.response?.data?.error || 'Error al conectar con el servidor.';
        setError(msg);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }}>
            <div className="text-center mb-4">
            <h2 className="fw-bold m-0">🔑 Iniciar Sesión</h2>
            </div>

            {error && (
            <div className="alert alert-danger py-2 px-3 mb-3 text-center" role="alert" style={{ fontSize: '14px' }}>
                ⚠️ {error}
            </div>
            )}

            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label fw-semibold">Correo Electrónico:</label>
                <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nombre@correo.com"
                />
            </div>

            <div className="mb-4">
                <label className="form-label fw-semibold">Contraseña:</label>
                <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-100 fw-bold py-2"
                disabled={loading}
            >
                {loading ? 'Autenticando...' : 'Entrar'}
            </button>
            </form>

            <div className="text-center mt-3 small">
            ¿No tienes cuenta? <Link to="/register" className="text-decoration-none fw-semibold">Regístrate aquí</Link>
            </div>
        </div>
        </div>
    );
}