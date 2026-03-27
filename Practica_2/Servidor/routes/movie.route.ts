import { Router } from 'express';
import { getMoviesByActor } from '../controllers/movie.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { CreateMovieSchema } from '../schemas/movie.schemas.js';

const router = Router();

router.get('/search', getMoviesByActor);

export default router;