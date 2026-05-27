import express from "express";
import dotenv from 'dotenv';
import corsMiddleware from "./config/cors.js";
import passport from "passport";
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(corsMiddleware);
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Servidor corriendo perfectamente'});
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor de castilla.rooms escuchando en http://localhost:${PORT}`);
});