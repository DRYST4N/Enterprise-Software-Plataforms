import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import passport from 'passport';
import festivarRoute from './routes/festival.route';
import entradaRoute from './routes/entrada.route';
import authRoutes from './routes/auth.route';


const app = express();

app.use(cors);
app.use(express.json());
app.use(passport.initialize());


app.use('/api/festivales', festivarRoute);
app.use('/api/entradas', entradaRoute);
app.use('/api/auth', authRoutes);


const PORT = 3000;
app.listen(PORT, () =>{
    console.log('Servidor corriendo perfectamente')
});