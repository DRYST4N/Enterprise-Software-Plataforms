import { Router } from 'express';
import * as TheaterController from '../controllers/theater.controller';
import { validate } from '../middlewares/validate.middlewares';
import { FilterTheaterbyTimeSchema, TheaterIdSchema } from '../schemas/theater.schemas';

const router = Router();

router.get('/', TheaterController.getAllTheaters);
router.get('/search-by-time', validate(FilterTheaterbyTimeSchema), TheaterController.getTheatersByTime);
router.get('/:id/schedule', validate(TheaterIdSchema),TheaterController.getTheaterSchedule);

export default router;