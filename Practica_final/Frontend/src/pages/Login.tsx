import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Login = () => {
    const { login } = useAuth();
    const navigate  = useNavigate();
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try{
            const res = await api.post('/auth/login', {correo, pass});
            login(res.data.token, res.data.role);
            if(res.data.role === 'Empresa') navigate('/empresa');
            else navigate('/festivales');
        } catch {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className='container d-flex justify-content-center align-items-center vh-100'>
            <div className='card p-4 shadow' style={{width: '400px'}}>
                <h3 className='text-center mb-4'>Iniciar Sesion</h3>
                {error && <div className='alert alert-danger'>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label className='form-label'>Correo</label>
                        <input
                        type="email"
                        className='form-control' 
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>Contraseña</label>
                        <input
                        type="password"
                        className='form-control'
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit" className='btn btn-primary w-100'>Entrar</button>
                </form>
                <p className='text-center mt-3'>
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;