import type { IAuthRepository } from "../auth.repository.js";

export class GetMisDatosUseCase {

    constructor(private authRepository: IAuthRepository){}

    async execute(userId: string){
        console.log(" [Use Case] Recuperando los datos del perfil del usuario.");

        if(!userId) {
            throw new Error('El identificador del usuario es obligatorio.');
        }

        const user = await this.authRepository.findById(userId);
        if(!user){
            throw new Error('El usuario solicitado no existe en el sistema.');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            perfil: user.role === 'CLIENTE' ? user.cliente : user.agencia
        };
    }
}