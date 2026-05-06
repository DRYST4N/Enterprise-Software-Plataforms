import { Router } from "express";
import { getFestivales, createFestival, getFestivalesPosibles } from "../controllers/festival.controller";

const router = Router();

router.get('/', getFestivales); //Todos los festivales, EMPRESAS
router.post('/', createFestival);//Crear el festival
router.get('/festivales', getFestivalesPosibles);//Ver festivales posibles para los CLIENTES

export default router;