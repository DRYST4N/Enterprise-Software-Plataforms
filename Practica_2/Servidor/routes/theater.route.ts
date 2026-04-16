import { Router } from 'express';
import * as TheaterController from '../controllers/theater.controller.js';
import { validate } from '../middlewares/validate.middlewares.js';
import { FilterTheaterbyTimeSchema, TheaterIdSchema } from '../schemas/theater.schemas.js';

const router = Router();

router.get('/', TheaterController.getAllTheaters);
router.get('/search-by-time', validate(FilterTheaterbyTimeSchema), TheaterController.getTheatersByTime);
router.get('/:id/schedule', validate(TheaterIdSchema),TheaterController.getTheaterSchedule);

export default router;