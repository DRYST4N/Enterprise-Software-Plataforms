import { CreateApartmentController } from "./createApartment.controller.js";
import { DeleteApartmentController } from "./deleteApartment.controller.js";
import { GetAllAparmentsController } from "./getAllApartments.controller.js";
import { GetInformeVentasController } from "./getInformeVentas.controller.js"; 
import { GetMisApartmentController } from "./getMisApartment.controller.js";
import { GetOneApartmentController } from "./getOneApartment.controller.js";
/*



import { UpdateApartmentController } from "./updateApartment.controller.js";


*/

export default (dependencies: any) => {
    return{
        createApartment: CreateApartmentController(dependencies),
        deleteApartment: DeleteApartmentController(dependencies),
        getAllApartments: GetAllAparmentsController(dependencies),
        getInformeVentas: GetInformeVentasController(dependencies),
        getMisApartments: GetMisApartmentController(dependencies),
        getOneApartment: GetOneApartmentController(dependencies),
        /*
        
        updateApartment: UpdateApartmentController(dependencies),
        
        
        */
    }
}