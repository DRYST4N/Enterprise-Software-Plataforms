import { Router } from "express";
import { getFestivales, createFestival, getFestivalesPosibles } from "../dtos/controllers/festival.controller";
import { checkEmpresa } from "../middleware/auth.middleware";

const router = Router();

router.get('/', checkEmpresa, getFestivales); //Todos los festivales, EMPRESAS
router.post('/', checkEmpresa, createFestival);//Crear el festival
router.get('/festivales', getFestivalesPosibles);//Ver festivales posibles para los CLIENTES

export default router;