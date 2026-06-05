import { AdminActionController } from "./verifyAgency.controller.js";

export const AdminControllers = (dependencies: any) => {
    return {
        AdminAction: AdminActionController(dependencies)
    }
}