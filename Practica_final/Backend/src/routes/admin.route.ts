import { Router } from 'express';
import { getEmpresas, verificarEmpresa, rechazarEmpresa } from '../controllers/admin.controller';
import { authenticate, checkRole } from '../middleware/auth.middleware';

const route = Router();

route.get('/empresas', authenticate, checkRole(['ADMIN']), getEmpresas);
route.patch('/empresas/:id/verificar', authenticate, checkRole(['ADMIN']), verificarEmpresa);
route.patch('/empresas/:id/rechazar', authenticate, checkRole(['ADMIN']), rechazarEmpresa);

export default route;