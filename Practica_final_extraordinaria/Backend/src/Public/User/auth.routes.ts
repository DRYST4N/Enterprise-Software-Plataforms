import { Router } from 'express';
import { RequireAuth } from '../middlewares/auth.middlewares.js';

export const setupAuthRoutes = (controllers: any) => {
    const router = Router();

    const auth = controllers.authController;

    router.post("/register/client", auth.createCliente);
    router.post("/register/agencia", auth.createAgencia);
    router.post("/login", auth.login);
    router.get("/me", RequireAuth, auth.getMisDatos);
    router.put("/me", RequireAuth, auth.updateMisDatos);

    return router;
}