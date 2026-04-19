import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { JWTStrategy } from './middlewares/jwt.strategy.js';
import movieRoutes from './routes/movie.route.js';
import theaterRoutes from './routes/theater.route.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware esenciales
app.use(cors());
app.use(express.json());

//Passport
passport.use(JWTStrategy);
app.use(passport.initialize())

// Rutas
 app.use('/api/movies', movieRoutes);
 app.use('/api/theater', theaterRoutes);
 app.use('/api/auth', authRoutes);

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor lanzado en el puerto 3000');
});