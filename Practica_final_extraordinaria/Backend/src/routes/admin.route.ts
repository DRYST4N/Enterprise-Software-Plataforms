import { Router } from 'express';
import { RequireAuth, checkRole } from '../middlewares/auth.middlewares.js';
import { Role } from '@prisma/client';
import { getAllAgencias, getAllApartamentos, updateAgenciaStatus, updateEstrellas } from '../controllers/admin.controller.js';

const router = Router();

router.use(RequireAuth, checkRole([Role.ADMIN]));

router.get('/agencias', getAllAgencias);
router.patch('/agencias/:id/status', updateAgenciaStatus);
router.patch('/apartamentos/estrellas', updateEstrellas);
router.get('/apartamentos', getAllApartamentos);

export default router;