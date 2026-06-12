import type { IAuthRepository } from "../auth.repository.js";
import bcrypt from 'bcrypt';
import type { CreateAgenciaInput } from "../auth.type.js";
import { error } from "node:console";
import { BadRequestError, ConflictError } from "../../../middlewares/Errors/CustomErrors.js";

export class CreateAgencia {
    constructor (private userRepository: IAuthRepository){}

    async execute(input: CreateAgenciaInput){
        console.log(" [Use Case] Procesando registro de agencia.");

        if(!input.email.includes('@')){
            throw new BadRequestError('El formato del correo electrónico no es válido.');
        }
        if(!input.cif || input.cif.trim().length < 9){
            throw new BadRequestError('El CIF es obligatorio y debe tener un formato válido para operar como agencia.');
        }

        if(!input.razonSocial){
            throw new BadRequestError('La razón social es obligatoria.');
        }
        
        const usuarioExistente = await this.userRepository.findByEmail(input.email);
        if(usuarioExistente){
            throw new ConflictError('El correo electrónico ya se encuentra registrado.');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.passwordPlano, salt);

        const userCreado = await this.userRepository.createAgencia({
            email: input.email,
            passwordHash: passwordHash,
            role: 'AGENCIA',
            razonSocial: input.razonSocial,
            cif: input.cif,
            domicilioSocial: input.domicilioSocial,
            nombreContacto: input.nombreContacto,
            telefono: input.telefono,
        })

        return {
            id: userCreado.id,
            email: userCreado.email,
            role:userCreado.role
        };
    }
}