import { Router } from "express";
import { getMisCompras, PaymentAplication } from "../controllers/payment.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authenticate, checkRole(['Cliente']), PaymentAplication);
router.get('/mis-compras', authenticate, checkRole(['Cliente']), getMisCompras);


export default router;