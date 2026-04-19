import { useState } from "react";
import { TextField, Button, Paper, Typography, Box, Tabs, Tab } from '@mui/material';
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () =>{
        setError('');
        try{
            if(tab === 0){
                //login
                const res = await api.post('/auth/login', {email, password});
                login(res.data.token, res.data.user);
                navigate('/');
            }else{
                //Registro
                await api.post('/auth/register', {email, password});
                setTab(0);
                setError('Registro exitoso, ahora inicia sesion');
            }
        }catch(error: any){
            console.error(error);
            setError(error.response?.data?.error || "error en la operacion");
        }
    };

    return (
        <Box sx = {{ display:"flex", justifyContent:"center", mt:8 }}>
            <Paper elevation={3} sx={{ p: 4, width: 400 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Iniciar Sesión" />
                <Tab label="Registrarse" />
                </Tabs>
                <Typography variant="h5" gutterBottom>
                {tab === 0 ? 'Iniciar Sesión' : 'Registro'}
                </Typography>
                <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <TextField
                label="Contraseña"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
                {error && <Typography color={error.includes('exitoso') ? 'success.main' : 'error'} sx={{ mt: 1 }}>{error}</Typography>}
                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
                {tab === 0 ? 'Entrar' : 'Registrarse'}
                </Button>
            </Paper>
        </Box>
  );
};