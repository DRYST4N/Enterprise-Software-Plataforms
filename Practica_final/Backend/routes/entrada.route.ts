import { Router } from "express";
import { CreateEntrada } from "../controllers/entrada.controller";

const router = Router();

router.post('/create', CreateEntrada );

export default router;