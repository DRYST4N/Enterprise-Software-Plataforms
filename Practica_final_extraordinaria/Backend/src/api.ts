/* import express from "express";
import dotenv from 'dotenv';
import corsMiddleware from "./config/cors.js";
import './config/passport.js';
import passport from "./config/passport.js";
import authRouter from './User/auth.routes.js';
import adminRouter from './Admin/admin.route.js';
import ApartamentoRouter from './Apartments/apartamentos.route.js';
import ReservaRouter from './Booking/reserva.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(corsMiddleware);
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/apartamento', ApartamentoRouter);
app.use('/api/reservas', ReservaRouter);


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Servidor corriendo perfectamente'});
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor de castilla.rooms escuchando en http://localhost:${PORT}`);
});
*/

import express from "express";
import { init } from "./dependencies.js";
import { router as apartmentRouter } from './Apartments/index.js';
import { router as authRouter} from './User/index.js';
import { router as bookingRouter} from './Booking/index.js';
import passport from './config/passport.js';
import corsMiddleware from "./config/cors.js";


const startServer = async () => {

    const app = express();

    app.use(express.json());
    app.use(passport.initialize());
    app.use(corsMiddleware);

    const dependencies = await init();


    app.use("/api/apartments", apartmentRouter(dependencies.controller));
    app.use("/api/auth", authRouter(dependencies.controller));
    app.use("/api/reservas", bookingRouter(dependencies.controller));

    app.listen(process.env.PORT, () => {
        console.log("El servidor de Castilla Rooms esta corriendo perfectamente.");
    });
};


startServer();