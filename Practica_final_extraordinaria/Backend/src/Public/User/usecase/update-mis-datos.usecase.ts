import type { IAuthRepository } from "../auth.repository.js";
import type { UpdateMisDatosInput } from "../auth.type.js";


export class UpdateMisDatosUseCase {
    constructor (private authRepository: IAuthRepository ) {}

    async execute(input: UpdateMisDatosInput) {
        console.log("[use Case] Validando actualizacion de perfil para el usuario.");
        if(!input.userId || !input.role ){
                throw new Error('No autorizado. Sesión invalida.');
            }

        if(input.role === 'CLIENTE' && input.nombreApellidos && input.nombreApellidos.trim().length < 4){
            throw new Error('El nombre y apellidos deben tener al menos 4 caracteres.');
        }

        if(input.role === 'AGENCIA' && input.razonSocial && input.razonSocial.trim().length < 2){
            throw new Error('La razón social no puede estar vacía.');
        }

        const userActualizado = await this.authRepository.updateProfile(input.userId, input.role, {
            nombreApellidos: input.nombreApellidos,
            razonSocial: input.razonSocial,
            nombreContacto: input.nombreContacto,
            domicilioSocial: input.domicilioSocial,
            telefono: input.telefono
        }as any)

        return {
            id: userActualizado.id,
            email: userActualizado.email,
            role: userActualizado.role,
            perfil: userActualizado.role === 'CLIENTE' ? userActualizado.cliente : userActualizado.agencia
        };
    }
}