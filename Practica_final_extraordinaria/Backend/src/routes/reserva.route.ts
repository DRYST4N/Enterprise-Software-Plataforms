import { Router } from 'express';
import { RequireAuth, checkRole } from '../middlewares/auth.middlewares.js';
import { Role } from '@prisma/client';
import { postReserva } from '../controllers/reserva.controller.js';

const router = Router();
router.use(RequireAuth, checkRole([Role.CLIENTE]));


router.post('/', postReserva);

export default router;