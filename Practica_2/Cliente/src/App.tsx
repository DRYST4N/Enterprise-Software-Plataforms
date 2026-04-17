import { Button, Container, Box} from '@mui/material';
import { Routes, Route, Link} from 'react-router-dom';
import { CinesList } from './components/CinesList';

function App(){
  return(
    <Container maxWidth ="sm">
      <Box sx={{py: 2, display: 'flex', gap: 2}}>
        <Button component={Link} to="/" variant='outlined'>Inicio</Button>
        <Button component={Link} to="/cines" variant='contained'>Ver Cines</Button> 
      </Box>

      <Routes>
        <Route path='/' element={<h1>Página de Inicio</h1>} />
        <Route path='/cines' element={<CinesList />} />
      </Routes>
    </Container>
  );
}

export default App;

