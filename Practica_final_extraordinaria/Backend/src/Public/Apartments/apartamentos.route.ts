import { Router } from 'express';
import { RequireAuth, checkRole } from '../../middlewares/auth.middlewares.js';
import { Role } from '@prisma/client';  
import controllers from './controllers/index.js';


export const setupApartmentRoutes = (dependencies: any) => {
    const router = Router();

    
    const { createApartment, deleteApartment, getAllApartments, getInformeVentas, getMisApartments, getOneApartment, updateApartment } = controllers(dependencies);

    //rutas Privadas
    router.post('/', RequireAuth, checkRole([Role.AGENCIA,]), createApartment);
    router.delete('/:id', RequireAuth, checkRole([Role.AGENCIA]), deleteApartment);
    router.get('/informe-venta', RequireAuth, checkRole([Role.AGENCIA]), getInformeVentas);
    router.get('/mis-apartment', RequireAuth, checkRole([Role.AGENCIA]), getMisApartments);
    router.put('/:id', RequireAuth, checkRole([Role.AGENCIA]), updateApartment);
    

    //Rutas publicas
    router.get('/', getAllApartments);
    router.get('/:id', getOneApartment);

    /*
    
*/

    return router;
}