import { Router } from "express";
import { registrarAgencia, registrarCliente, login } from "../controllers/auth.controller.js";


const router =  Router();


router.post('/registrar/cliente', registrarCliente);
router.post('/registrar/agencia', registrarAgencia);
router.post('/login', login);

export default router;