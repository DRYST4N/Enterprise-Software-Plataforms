import { Router } from 'express';
import { RequireAuth } from '../../middlewares/auth.middlewares.js';
import controllers from './controller/index.js';

export const setupAuthRoutes = (dependencies: any) => {
    const router = Router();

    const { createCliente, createAgencia, getMisDatos, updateMisDatos, login,} = controllers(dependencies);

    router.post("/register/client", createCliente);
    router.post("/register/agencia", createAgencia);
    router.post("/login", login);
    router.get("/me", RequireAuth, getMisDatos);
    router.put("/me", RequireAuth, updateMisDatos);

    return router;
}