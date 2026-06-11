import { GetAllApartmentsController } from "./getAllApartments.controller.js";
import { UpdateEstrellasController } from "./updateEstrellas.controller.js";

export default (dependencies: any) =>  {
    return {
        getAllApartments: GetAllApartmentsController(dependencies),
        updateEstrellas: UpdateEstrellasController(dependencies)
    }
}