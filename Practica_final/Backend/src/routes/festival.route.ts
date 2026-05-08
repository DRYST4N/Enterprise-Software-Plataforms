import { Router } from "express";
import { getFestivales, createFestival, getFestivalesDisponibles, getMisFestivales, cancelarFestival, editarFestival } from "../controllers/festival.controller";
import { checkRole, authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get('/mis-festivales', authenticate, checkRole(['EMPRESA']), getMisFestivales); //Todos los festivales, EMPRESAS
router.post('/', authenticate, checkRole(['EMPRESA']), createFestival);//Crear el festival
router.get('/disponibles', getFestivalesDisponibles); //Este si que es para clientes
router.patch('/:id/cancel', authenticate, checkRole(['EMPRESA']), cancelarFestival); //Este para cancelar los festivales
router.patch('/:id/update', authenticate, checkRole(['EMPRESA']), editarFestival);//Para editar el festival

export default router;