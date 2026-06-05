import { Router } from 'express';
import { RequireAuth, checkRole } from '../middlewares/auth.middlewares.js';
import { Role } from '@prisma/client';  


export const setupApartmentRoutes = (controllers: any) => {
    const router = Router();

    
    const apartment = controllers.apartamentController;

    //rutas privadas
    router.post('/',RequireAuth, checkRole([Role.AGENCIA]), apartment.createApartment);
    router.put('/:id', RequireAuth, checkRole([Role.AGENCIA]), apartment.updateApartment);
    router.get('/mis-apartment', RequireAuth, checkRole([Role.AGENCIA]), apartment.getMisApartments);
    router.delete('/:id', RequireAuth, checkRole([Role.AGENCIA]), apartment.deleteApartment);
    router.get('/informe-venta', RequireAuth, checkRole([Role.AGENCIA]), apartment.getInformeVentas);

    //Rutas publicas
    router.get('/', apartment.getAllApartments);
    router.get('/:id', apartment.getOneApartment);


    return router;
}