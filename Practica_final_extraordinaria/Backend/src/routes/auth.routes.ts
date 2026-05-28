import { Router } from "express";
import { registrarAgencia, registrarCliente, login } from "../controllers/auth.controller.js";


const router =  Router();


router.post('/register/cliente', registrarCliente);
router.post('/register/agencia', registrarAgencia);
router.post('/login', login);

export default router;