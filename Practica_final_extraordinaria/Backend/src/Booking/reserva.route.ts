import { Router } from 'express';
import { RequireAuth, checkRole } from '../middlewares/auth.middlewares.js';

export const setupBookingRoutes = (controllers: any) => {
    const router = Router();

    const { booking } = controllers.bookingController;

    router.post("/", RequireAuth, checkRole(['CLIENTE']), booking.postResereva);
    router.get("/mis-reservas", RequireAuth, checkRole(['CLIENTE']), booking.getMisReservas);

    return router;
}