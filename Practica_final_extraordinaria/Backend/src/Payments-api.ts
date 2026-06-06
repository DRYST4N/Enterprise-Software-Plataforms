import express from 'express';
import { init } from './dependencies.js';
import { router as bookingRouter } from './Booking/index.js';
import passport from './config/passport.js';
import corsMiddleware from './config/cors.js';

const startPaymentAPI = async() => {
    const app = express();

    app.use(express.json());
    app.use(corsMiddleware);
    app.use(passport.initialize());

    const dependencies = await init();

    app.use("/api/reservas", bookingRouter(dependencies.controller));

    app.listen(process.env.PAYMENT_PORT, () => {
        console.log("El servidor de reservas y pagos esta corriendo a la perfeccion.")
    });
}


startPaymentAPI();