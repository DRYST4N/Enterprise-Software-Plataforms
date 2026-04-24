import { Router } from "express";
import { getFestivales, createFestival } from "../controllers/festival.controller";

const router = Router();

router.get('/', getFestivales);
router.post('/', createFestival);

export default router;