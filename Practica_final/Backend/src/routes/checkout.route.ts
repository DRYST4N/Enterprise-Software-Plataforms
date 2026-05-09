import { Router } from "express";
import { PaymentAplication } from "../controllers/payment.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authenticate, checkRole(['Cliente']), PaymentAplication);


export default router;