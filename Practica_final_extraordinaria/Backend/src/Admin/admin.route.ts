/*import { Router } from 'express';
import { RequireAuth, checkRole } from '../middlewares/auth.middlewares.js';
import { Role } from '@prisma/client';
import { getAllAgencias, getAllApartamentos, updateAgenciaStatus, updateEstrellas } from './admin.controller.js';

const router = Router();

router.use(RequireAuth, checkRole([Role.ADMIN]));

router.get('/agencias', getAllAgencias);
router.patch('/apartamentos/estrellas', updateEstrellas);
router.get('/apartamentos', getAllApartamentos);

export default router;*/

import { Router } from 'express';
import { RequireAuth, checkRole } from '../middlewares/auth.middlewares.js';

export const setupAdminRoutes = (controller: any) => {
    const router = Router();

    const { adminAction} = controller.adminController;

    router.use(RequireAuth, checkRole(['ADMIN']));

    router.put('/verify-agency/:agenciaId', adminAction.verifyAgency);
    router.get("/agencias", adminAction.getAllAgencies);

    router.get("/apartments", adminAction.getAllApartments);
    router.patch("/apartments/:apartamentoId/estrellas", adminAction.updateEstrellas);

    return router;
}
