import { Router } from 'express';
import { actualizarDatos, borrarCuenta, getMisDatos, login, register } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/cuenta', authenticate, borrarCuenta);
router.get('/mis-datos', authenticate, getMisDatos);
router.patch('/mis-datos', authenticate, actualizarDatos);

export default router;