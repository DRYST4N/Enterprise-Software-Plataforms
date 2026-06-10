import { CreateAgenciaController } from "./createAgencia.controller.js";
import { CreateClienteController } from "./createCliente.controller.js";
import { LoginController } from "./login.controller.js";
import { ProfileController } from "./profile.controller.js";

export const AuthControllers = (dependencies: any) =>  {
    return {
        createCliente: CreateClienteController(dependencies),
        createAgencia: CreateAgenciaController(dependencies),
        login: LoginController(dependencies),
        profile: ProfileController(dependencies)
    }
}