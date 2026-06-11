import { Router } from 'express'; 
import { router as ApartmentsRouter } from './Apartments';
import { router as AuthRouter} from './User';



export default (dependencies: any) => {
    const router = Router();

    
    
    router.use('/apartments', ApartmentsRouter(dependencies));
    router.use('/auth', AuthRouter(dependencies));
    

    return router;
}