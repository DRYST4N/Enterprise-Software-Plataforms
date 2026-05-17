import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import passport from './config/passport';
import { fileURLToPath } from 'url';
import {dirname, join} from 'path';
import festivarRoute from './routes/festival.route';
import entradaRoute from './routes/entrada.route';
import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';
import checkoutRoute from './routes/checkout.route';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, '../public/uploads')));
app.use(passport.initialize());


app.use('/api/festivales', festivarRoute);
app.use('/api/entradas', entradaRoute);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', checkoutRoute);


const PORT = 3000;
app.listen(PORT, () =>{
    console.log('Servidor corriendo perfectamente')
});