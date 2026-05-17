import { Router } from "express";
import { CreateEntrada } from "../controllers/entrada.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";

const router = Router();

router.post('/create', authenticate, checkRole(['Empresa']), CreateEntrada );

export default router;