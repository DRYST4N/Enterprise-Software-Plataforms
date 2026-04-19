import { Router } from 'express';
import passport from 'passport';
import * as MovieController from '../controllers/movie.controller.js';
import { requireAdminOrCinemaOwner } from '../middlewares/roles.middlewares.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { FilterByDateSchema, SearchByActorSchema } from '../schemas/movie.schemas.js';

const router = Router();

const jwtAuth = passport.authenticate('jwt', { session: false });


//Rutas publicas
router.get('/', MovieController.getAllMovies);
router.get('/search', validate(SearchByActorSchema), MovieController.getMoviesByActor);
router.get('/by-date', validate(FilterByDateSchema), MovieController.getMoviesByDate);

// Rutas protegidas (solo ADMIN o CINEMAOWNER)
router.post('/', jwtAuth, requireAdminOrCinemaOwner, MovieController.createMovie);
router.put('/:id', jwtAuth, requireAdminOrCinemaOwner, MovieController.updateMovie);
router.delete('/:id', jwtAuth, requireAdminOrCinemaOwner, MovieController.deleteMovie);

export default router;