import { Router } from 'express';
import { getEmpresas, verificarEmpresa, rechazarEmpresa } from '../controllers/admin.controller';
import { checkAdmin } from '../middleware/auth.middleware';

const route = Router();

route.get('/empresas', checkAdmin, getEmpresas);
route.patch('/empresas/:id/verificar', checkAdmin, verificarEmpresa);
route.patch('/empresas/:id/rechazar', checkAdmin, rechazarEmpresa);

export default route;