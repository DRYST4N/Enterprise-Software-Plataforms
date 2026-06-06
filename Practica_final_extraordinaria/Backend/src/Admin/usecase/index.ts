import { GetAllAgencies } from "./get-all-agencies.usecase.js";
import { GetAllAparments } from "./get-all-apartments.usecase.js";
import { GetServicesStatusUseCase } from "./get-services-status.usecase.js";
import { UpdateEstrellasUseCase } from "./update-estrellas.js";
import { VerifyAgencyUseCase } from "./verify-agency.usecase.js";

export const AdminUseCase = {
    VerifyAgencyUseCase,
    GetAllAgencies,
    GetAllAparments,
    UpdateEstrellasUseCase,
    GetServicesStatusUseCase
}