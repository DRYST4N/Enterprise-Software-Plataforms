import { Router } from "express";
import { getFestivales, createFestival, getFestivalesPosibles } from "../controllers/festival.controller";
import { checkRole } from "../middleware/auth.middleware";

const router = Router();

router.get('/', checkRole(['EMPRESA']), getFestivales); //Todos los festivales, EMPRESAS
router.post('/', checkRole(['EMPRESA']), createFestival);//Crear el festival
router.get('/festivales', getFestivalesPosibles);//Ver festivales posibles para los CLIENTES

export default router;