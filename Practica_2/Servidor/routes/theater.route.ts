import { Router } from 'express';
import passport from 'passport';
import * as TheaterController from '../controllers/theater.controller';
import { validate } from '../middlewares/validate.middlewares';
import { requireAdminOrCinemaOwner } from '../middlewares/roles.middlewares';
import { FilterTheaterbyTimeSchema, TheaterIdSchema } from '../schemas/theater.schemas';

const router = Router();

const jwtAuth = passport.authenticate('jwt', { session: false });

//Rutas publicas
router.get('/', TheaterController.getAllTheaters);
router.get('/search-by-time', validate(FilterTheaterbyTimeSchema), TheaterController.getTheatersByTime);
router.get('/:id/schedule', validate(TheaterIdSchema),TheaterController.getTheaterSchedule);

//Rutas protegidas
router.post('/', jwtAuth, requireAdminOrCinemaOwner, TheaterController.createTheater);
router.put('/:id', jwtAuth, requireAdminOrCinemaOwner, TheaterController.updateTheater);
router.delete('/:id', jwtAuth, requireAdminOrCinemaOwner, TheaterController.deleteTheater);

export default router;