import { Router } from "express";
import controllers from "./controllers/index.js";

export const setupAdminApartmentsRouter = (dependencies: any) => {

    const router = Router();
    const { getAllApartments, updateEstrellas } = controllers(dependencies);

    
    router.get("/", getAllApartments);
    router.patch("/:apartamentoId/estrellas", updateEstrellas);


    return router;
}