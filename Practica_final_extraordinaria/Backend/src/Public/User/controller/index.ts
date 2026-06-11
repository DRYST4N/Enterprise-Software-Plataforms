import { CreateAgenciaController } from "./createAgencia.controller.js";
import { CreateClienteController } from "./createCliente.controller.js";
import { getMisDatosController } from "./getMisDatos.controller.js";
import { LoginController } from "./login.controller.js";
import { UpdateMisDatosController } from "./updateMisDatos.controller.js";


export default (dependencies: any) =>  {
    return {
        createCliente: CreateClienteController(dependencies),
        createAgencia: CreateAgenciaController(dependencies),
        login: LoginController(dependencies),
        getMisDatos: getMisDatosController(dependencies),
        updateMisDatos: UpdateMisDatosController(dependencies)
    }
}