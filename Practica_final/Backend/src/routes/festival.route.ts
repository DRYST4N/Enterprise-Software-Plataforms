import { Router } from "express";
import { getFestivales, createFestival, getFestivalesDisponibles, getMisFestivales, cancelarFestival, editarFestival } from "../controllers/festival.controller";
import { checkRole, authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get('/mis-festivales', authenticate, checkRole(['Empresa']), getMisFestivales); //Todos los festivales, EmpresaS
router.post('/', authenticate, checkRole(['Empresa']), createFestival);//Crear el festival
router.get('/disponibles', getFestivalesDisponibles); //Este si que es para clientes
router.patch('/:id/cancel', authenticate, checkRole(['Empresa']), cancelarFestival); //Este para cancelar los festivales
router.patch('/:id/update', authenticate, checkRole(['Empresa']), editarFestival);//Para editar el festival

export default router;