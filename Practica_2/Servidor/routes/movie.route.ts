import { Router } from 'express';
// Fíjate en el .js al final de cada ruta local
import * as MovieController from '../controllers/movie.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { FilterByDateSchema, SearchByActorSchema } from '../schemas/movie.schemas.js';

const router = Router();

router.get('/', MovieController.getAllMovies);
router.get('/search', validate(SearchByActorSchema), MovieController.getMoviesByActor);
router.get('/by-date', validate(FilterByDateSchema), MovieController.getMoviesByDate);

export default router;