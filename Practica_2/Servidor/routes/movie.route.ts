import { Router } from 'express';
import * as MovieController from '../controllers/movie.controller';
import { validate } from '../middlewares/validate.middlewares';
import { FilterByDateSchema, SearchByActorSchema } from '../schemas/movie.schemas';

const router = Router();

router.get('/', MovieController.getAllMovies);
router.get('/search', validate(SearchByActorSchema),MovieController.getMoviesByActor);
router.get('/by-date', validate(FilterByDateSchema), MovieController.getMoviesByDate);

export default router;