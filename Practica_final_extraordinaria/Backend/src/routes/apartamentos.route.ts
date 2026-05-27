import { Router } from 'express';
import { RequireAuth, checkRole } from '../middlewares/auth.middlewares.js';
import { Role } from '@prisma/client';
import { createApartamento, getMisApartamentos, updateApartamentos, deleteApartamento, getInformeVentas } from '../controllers/apartamento.controller.js';

const router = Router();

router.use(RequireAuth, checkRole([Role.AGENCIA]));

router.post('/', createApartamento);
router.get('/mis-apartamentos', getMisApartamentos);
router.put('/:id', updateApartamentos);
router.delete('/:id', deleteApartamento);
router.get('/informe-ventas', getInformeVentas)


export default router;