import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [role, setRole] = useState<'Cliente' | 'Empresa'>('Cliente');
    const [form, setForm] = useState({
        correo: '',
        pass: '',
        nombre_completo: '',
        dni: '',
        fecha_nacimiento: '',
        telefono: '',
        razon_social: '',
        cif: '',
        nombre_empresa: '',
        domicilio_social: '',
        nombre_contacto: '',
        telefono_contacto: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try{
            await api.post('/auth/register', {...form, role});
            navigate('/login');
        }catch(error: any){
            setError(error.response?.datat?.error || 'Error al registrarse');
        }
    };

    return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
        <div className="card p-4 shadow" style={{ width: '450px' }}>
            <h3 className="text-center mb-4">Registro</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input name="correo" type="email" className="form-control"
                    onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input name="pass" type="password" className="form-control"
                        onChange={handleChange} required minLength={6} />
                    <div className="form-text text-muted">Mínimo 6 caracteres</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de cuenta</label>
                        <select className="form-select" value={role}
                        onChange={(e) => setRole(e.target.value as 'Cliente' | 'Empresa')}>
                            <option value="Cliente">Cliente</option>
                            <option value="Empresa">Empresa</option>
                        </select>
                </div>

            {role === 'Cliente' && (
            <>
                <div className="mb-2">
                <input name="nombre_completo" placeholder="Nombre completo *"
                    className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-2">
                <input name="dni" placeholder="DNI *"
                    className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-2">
                <label className="form-label text-muted small">Fecha de nacimiento *</label>
                <input name="fecha_nacimiento" type="date"
                    className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-2">
                <input name="telefono" placeholder="Teléfono *"
                    className="form-control" onChange={handleChange} required />
                </div>
            </>
            )}

            {role === 'Empresa' && (
            <>
                <div className="mb-2">
                <input name="razon_social" placeholder="Razón social *"
                    className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-2">
                <input name="cif" placeholder="CIF *"
                    className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-2">
                <input name="nombre_empresa" placeholder="Nombre empresa *"
                    className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-2">
                <input name="domicilio_social" placeholder="Domicilio social *"
                    className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-2">
                <input name="nombre_contacto" placeholder="Nombre de contacto *"
                    className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-2">
                <input name="telefono_contacto" placeholder="Teléfono de contacto *"
                    className="form-control" onChange={handleChange} required />
                </div>
            </>
            )}

            <button type="submit" className="btn btn-success w-100">Registrarse</button>
            </form>
            <p className="text-center mt-3">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
        </div>
    </div>
    );
};
export default Register;