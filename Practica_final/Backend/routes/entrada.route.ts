import { Router } from "express";
import { CreateEntrada } from "../controllers/entrada.controller";
import { checkEmpresa } from "../middleware/auth.middleware";

const router = Router();

router.post('/create', checkEmpresa, CreateEntrada );

export default router;