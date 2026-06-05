import { CreateApartment } from "./create-apartment.js";
import { DeleteApartment } from "./delete-apartment.js";
import { GetAllAparments } from "./get-all-apartments.js";
import { GetInformeVentas } from "./get-informe-ventas.js";
import { GetMisApartment } from "./get-mis-apartments.js";
import { GetOneApartment } from "./get-one-apartment.js";
import { UpdateApartment } from "./update-apartament.js";

export const ApartmentsUseCases = {
    CreateApartment,
    GetAllAparments,
    GetOneApartment,
    UpdateApartment,
    GetMisApartment,
    DeleteApartment,
    GetInformeVentas
}