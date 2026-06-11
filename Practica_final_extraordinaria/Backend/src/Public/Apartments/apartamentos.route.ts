import { Router } from 'express';
import { RequireAuth, checkRole } from '../../middlewares/auth.middlewares.js';
import { Role } from '@prisma/client';  
import controllers from './controllers/index.js';


export const setupApartmentRoutes = (dependencies: any) => {
    const router = Router();

    
    const { createApartment, deleteApartment } = controllers(dependencies);

    //rutas privadas
    router.post('/', RequireAuth, checkRole([Role.AGENCIA,]), createApartment);
    router.delete('/:id', RequireAuth, checkRole([Role.AGENCIA]), deleteApartment);
    /*
    router.put('/:id', RequireAuth, checkRole([Role.AGENCIA]), apartment.updateApartment);
    router.get('/mis-apartment', RequireAuth, checkRole([Role.AGENCIA]), apartment.getMisApartments);
    
    router.get('/informe-venta', RequireAuth, checkRole([Role.AGENCIA]), apartment.getInformeVentas);

    //Rutas publicas
    router.get('/', apartment.getAllApartments);
    router.get('/:id', apartment.getOneApartment);
*/

    return router;
}