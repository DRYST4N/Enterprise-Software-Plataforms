import { useEffect, useState } from 'react';
import { 
  List, ListItem, ListItemText, Paper, Typography, 
  CircularProgress, Button, Box, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions
} from '@mui/material';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

interface Theater {
  id: number;
  name: string;
  capacity: number;
  ownerId: number;
}

export const CinesList = () => {
  const [cines, setCines] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCine, setEditingCine] = useState<Theater | null>(null);
  const [editName, setEditName] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const { user, token, isAdmin } = useAuth();

  const fetchCines = () => {
    api.get('/theater')
      .then(response => {
        setCines(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando cines", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCines();
  }, []);

  const handleEditOpen = (cine: Theater) => {
    setEditingCine(cine);
    setEditName(cine.name);
    setEditCapacity(String(cine.capacity));
  };

  const handleEditSave = async () => {
    if (!editingCine) return;
    try {
      await api.put(`/theater/${editingCine.id}`, 
        { name: editName, capacity: parseInt(editCapacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCine(null);
      fetchCines();
    } catch (err) {
      console.error('Error al actualizar', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/theater/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCines();
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  const canEdit = (cine: Theater) => {
    if (!user) return false;
    if (isAdmin()) return true;
     if (user.role === 'CINEMA' && cine.ownerId === user.id) return true;
    return false;
  };

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
            {canEdit(cine) && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => handleEditOpen(cine)}>
                  Editar
                </Button>
                {isAdmin() && (
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(cine.id)}>
                    Eliminar
                  </Button>
                )}
              </Box>
            )}
          </ListItem>
        ))}
      </List>

      {/* Dialog de edición */}
      <Dialog open={!!editingCine} onClose={() => setEditingCine(null)}>
        <DialogTitle>Editar Cine</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="normal"
            value={editName}
            onChange={e => setEditName(e.target.value)}
          />
          <TextField
            label="Capacidad"
            type="number"
            fullWidth
            margin="normal"
            value={editCapacity}
            onChange={e => setEditCapacity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingCine(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};