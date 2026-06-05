import { CreateAgencia } from "./create-agencia.usecase.js";
import { CreateCliente } from "./create-cliente.usecase.js";
import { GetMisDatosUseCase } from "./get-mis-datos.usecase.js";
import { LoginUseCase } from "./login.usecase.js";
import { UpdateMisDatosUseCase } from "./update-mis-datos.usecase.js";

export const AuthUsesCases = {
    CreateAgencia,
    CreateCliente,
    LoginUseCase,
    GetMisDatosUseCase,
    UpdateMisDatosUseCase
}