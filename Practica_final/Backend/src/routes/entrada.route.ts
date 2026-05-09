import { Router } from "express";
import { CreateEntrada } from "../controllers/entrada.controller";
import { checkRole } from "../middleware/auth.middleware";

const router = Router();

router.post('/create', checkRole(['Empresa']), CreateEntrada );

export default router;