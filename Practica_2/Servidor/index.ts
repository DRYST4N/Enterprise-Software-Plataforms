import express from 'express';
import cors from 'cors';
import movieRoutes from './routes/movie.route.js' 

const app = express();

// Middleware esenciales
app.use(cors());
app.use(express.json());

// Rutas
 app.use('/api/movies', movieRoutes);

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor lanzado en el puerto 3000');
});