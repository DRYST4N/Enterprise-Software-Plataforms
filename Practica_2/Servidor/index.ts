import express from 'express'
import cors from 'cors'
import movieRoutes from './routes/movie.route'
import theaterRoutes from './routes/theater.route'


const app = express();


// Middleware esenciales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);


// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor lanzado en el puerto 3000');
});