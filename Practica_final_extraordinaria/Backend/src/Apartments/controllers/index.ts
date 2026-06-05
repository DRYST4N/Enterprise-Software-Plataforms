import { GetAllAparmentsController } from "./getAllApartments.controller.js";
import { CreateApartmentController } from "./createApartment.controller.js";
import { GetOneApartmentController } from "./getOneApartment.controller.js";
import { UpdateApartmentController } from "./updateApartment.controller.js";
import { GetMisAPartmentController } from "./getMisApartment.controller.js";
import { DeleteApartmentController } from "./deleteApartment.controller.js";
import { GetInformeVentasController } from "./getInformeVentas.controller.js";

export const controller = (dependencies: any) => {
    return{
        apartment: CreateApartmentController(dependencies),
        getAllApartments: GetAllAparmentsController(dependencies),
        getOneApartment: GetOneApartmentController(dependencies),
        updateApartment: UpdateApartmentController(dependencies),
        getMisApartments: GetMisAPartmentController(dependencies),
        deleteApartment: DeleteApartmentController(dependencies),
        getInformeVentas: GetInformeVentasController(dependencies)
    }
}