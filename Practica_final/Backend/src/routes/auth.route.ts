import { Router } from 'express';
import { login, register } from '../dtos/controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;