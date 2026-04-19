import { Button, Container, Box } from '@mui/material';
import { Routes, Route, Link } from 'react-router-dom';
import { CinesList } from './components/CinesList';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 2, display: 'flex', gap: 2 }}>
        <Button component={Link} to="/" variant='outlined'>Inicio</Button>
        <Button component={Link} to="/cines" variant='contained'>Ver Cines</Button>
        {user ? (
          <>
            <Button variant='outlined' color='error' onClick={logout}>Cerrar Sesión</Button>
          </>
        ) : (
          <Button component={Link} to="/login" variant='outlined' color='success'>Login</Button>
        )}
      </Box>

      <Routes>
        <Route path='/' element={<h1>Página de Inicio</h1>} />
        <Route path='/cines' element={<CinesList />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </Container>
  );
}

export default App;