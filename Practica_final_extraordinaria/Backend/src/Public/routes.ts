import { Router } from 'express'; 
import { router as ApartmentsRouter } from './Apartments';
import { router as AuthRouter} from './User';
import { router as BookingRouter} from './Booking';



export default (dependencies: any) => {
    const router = Router();

    
    
    router.use('/apartments', ApartmentsRouter(dependencies));
    router.use('/auth', AuthRouter(dependencies));
    router.use('/booking', BookingRouter(dependencies));
    

    return router;
}