import { BloquedAgenciesController } from "./bloqueoAgencies.controller.js"
import { GetAllAgenciesController } from "./getAllAgencies.controller.js"
import { VerifyAgencyController } from "./verifyAgency.controller.js"

export default (dependencies: any) => {
    return{
        getAllAgencies: GetAllAgenciesController(dependencies),
        verifyAgency: VerifyAgencyController(dependencies),
        bloquearAgency: BloquedAgenciesController(dependencies)
    }
}