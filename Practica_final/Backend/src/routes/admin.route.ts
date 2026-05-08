import { Router } from 'express';
import { getEmpresas, verificarEmpresa, rechazarEmpresa } from '../controllers/admin.controller';
import { checkRole } from '../middleware/auth.middleware';

const route = Router();

route.get('/empresas', checkRole(['Admin']), getEmpresas);
route.patch('/empresas/:id/verificar', checkRole(['Admin']), verificarEmpresa);
route.patch('/empresas/:id/rechazar', checkRole(['Admin']), rechazarEmpresa);

export default route;