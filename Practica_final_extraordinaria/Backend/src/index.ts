import express from "express";
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import corsMiddleware from "./config/cors.js";
import passport from "passport";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(corsMiddleware);
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRouter);


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Servidor corriendo perfectamente'});
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor de castilla.rooms escuchando en http://localhost:${PORT}`);
});