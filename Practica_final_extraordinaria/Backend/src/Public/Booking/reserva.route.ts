import { Router } from 'express';
import { RequireAuth, checkRole } from '../../middlewares/auth.middlewares.js';
import controllers from './controllers';


export const setupBookingRoutes = (dependencies: any) => {
    const router = Router();

    const { createBooking, getMisReservas } = controllers(dependencies);

    router.post("/", RequireAuth, checkRole(['CLIENTE']), createBooking);
    router.get("/mis-reservas", RequireAuth, checkRole(['CLIENTE']), getMisReservas);

    return router;
}