import type { IAuthRepository } from "../auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type{ LoginInput } from "../auth.type.js";

export class LoginUseCase {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura_de_castilla_rooms';

    constructor(private authRepository: IAuthRepository){}

    async execute(input: LoginInput){
        console.log("[Use Case] Procesando intento de login. ");

        const user = await this.authRepository.findByEmail(input.email);
        if(!user) {
            throw new Error("Las credenciales introducidas no son correctas.");
        }

        const passwordCorrecto = await bcrypt.compare(input.passwordPlano, user.password);
        if(!passwordCorrecto) {
            throw new Error("Las credenicales introducidas no son correctas.");
        }

        if(user.role === 'AGENCIA' && user.agencia?.bloqueada){
            throw new Error("Esa cuenta de agencia se encuentra bloqueada por el Administrador.");
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            cliente: user.cliente ? { id: user.cliente.id } : null,
            agencia: user.agencia ? { id: user.agencia.id } : null
        }

        const token = jwt.sign(payload, this.JWT_SECRET, { expiresIn: '2h' });

        return {
            token,
            user:{
                id: user.id,
                email: user.email,
                role: user.role,
                nombre: user.cliente?.nombreApellidos || user.agencia?.razonSocial || 'Administrador'
            }
        };
    }
}