import { Router } from 'express';
import { RequireAuth, checkRole } from '../middlewares/auth.middlewares.js';
import { router as ApartmentsRouter } from './Apartments';
import { router as AgenciesRouter} from './Agencies';

export default (dependencies: any) => {
    const router = Router();


    router.use(RequireAuth, checkRole(['ADMIN']));

    router.use("/apartments", ApartmentsRouter(dependencies));
    router.use("/agencies", AgenciesRouter(dependencies));


    return router;
}
