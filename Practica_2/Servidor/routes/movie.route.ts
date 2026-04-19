import { Router } from 'express';
import passport from 'passport';
import * as MovieController from '../controllers/movie.controller.js';
import { requireAdmin } from '../middlewares/roles.middlewares.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { FilterByDateSchema, SearchByActorSchema } from '../schemas/movie.schemas.js';

const router = Router();

const jwtAuth = passport.authenticate('jwt', { session: false });


//Rutas publicas
router.get('/', MovieController.getAllMovies);
router.get('/search', validate(SearchByActorSchema), MovieController.getMoviesByActor);
router.get('/by-date', validate(FilterByDateSchema), MovieController.getMoviesByDate);

// Rutas protegidas (solo ADMIN)
router.post('/', jwtAuth, requireAdmin, MovieController.createMovie);
router.put('/:id', jwtAuth, requireAdmin, MovieController.updateMovie);
router.delete('/:id', jwtAuth, requireAdmin, MovieController.deleteMovie);

export default router;