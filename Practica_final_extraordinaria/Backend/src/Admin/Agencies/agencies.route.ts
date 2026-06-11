import { Router } from "express";
import controllers from "./controllers/index.js";

export const setupAdminAgenciesRouter = (dependencies: any) => {
    const router = Router();

    const { getAllAgencies, verifyAgency, bloquearAgency } = controllers(dependencies);

    router.get("/", getAllAgencies);
    router.put("/verify-agency/:agenciaId", verifyAgency);
    router.put("/bloqued-agency/:agenciaId", bloquearAgency);

    return router;
}