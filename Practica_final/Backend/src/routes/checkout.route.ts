import { Router } from "express";
import { getMisCompras, PaymentAplication, procesarReembolso } from "../controllers/payment.controller";
import { authenticate, checkRole } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authenticate, checkRole(['Cliente']), PaymentAplication);
router.get('/mis-compras', authenticate, checkRole(['Cliente']), getMisCompras);
router.post('/:id/reembolso', authenticate, checkRole(['Cliente']), procesarReembolso);


export default router;