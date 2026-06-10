import { Router } from 'express'; 
import { router as ApartmentsRouter } from './Apartments'



export default (dependencies: any) => {
    const router = Router();

    

    
    router.use('/apartments', ApartmentsRouter(dependencies));
    

    return router;
}