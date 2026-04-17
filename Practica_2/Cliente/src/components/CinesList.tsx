import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Paper, Typography, CircularProgress } from '@mui/material';
import { api } from '../utils/api';

// Definimos la interfaz basándonos en tu DTO del backend
interface Theater {
  id: number;
  name: string;
  capacity: number;
}

export const CinesList = () => {
  const [cines, setCines] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/theaters')
      .then(response => {
        setCines(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando cines", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>Nuestros Cines</Typography>
      <List>
        {cines.map((cine) => (
          <ListItem key={cine.id} divider>
            <ListItemText 
              primary={cine.name} 
              secondary={`Capacidad: ${cine.capacity} personas`} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};