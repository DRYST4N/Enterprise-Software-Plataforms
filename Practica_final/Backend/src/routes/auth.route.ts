import { Router } from 'express';
import { borrarCuenta, login, register } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/cuenta', authenticate, borrarCuenta);

export default router;