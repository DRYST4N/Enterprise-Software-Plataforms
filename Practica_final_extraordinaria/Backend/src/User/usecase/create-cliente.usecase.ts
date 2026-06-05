import type { IAuthRepository } from "../auth.repository.js";
import { UserEntity } from "../auth.entity.js";
import bcrypt from "bcrypt";
import type { CreateClienteInput } from "../auth.type.js";
import { throwDeprecation } from "node:process";

export class CreateCliente {
    constructor(private userRepository: IAuthRepository) {}

    async execute(input: CreateClienteInput) {
        console.log("[Use Case] Procesando registro del cliente.");

        const usuarioExistente = await this.userRepository.findByEmail(input.email);
        if(usuarioExistente){
            throw new Error('El correo electrónico ya se encuantra registrado.');
        }

        if (!input.email.includes('@')){
            throw new Error(' El formato del correo electrónico no es válido');
        }
        if (!input.nombreApellidos || input.nombreApellidos.trim().length < 4){
            throw new Error('Es obligatorio aportar nombre y apellidos válidos.');
        }
        if(!input.dni){
            throw new Error('El DNI es un campo obligatorio para los clientes.');
        }
        const fechaNac = new Date(input.fechaNacimiento);
        const hoy = new Date();

        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if(mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())){
            edad--;
        }
        if(isNaN(fechaNac.getTime())){
            throw new Error('La fecha de nacimiento instroducida no es válida');
        }
        if(edad < 18){
            throw new Error('El cliente debe ser mayor de edad (mínimo 18 años) para registrarse.');
        }
        if(edad > 100){
            throw new Error('La fecha de nacimiento no es coherente (máximo 100 años).');
        }
        

        const salt  = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(input.passwordPlano, salt);

        const userCreado = await this.userRepository.createCliente({
            email: input.email,
            passwordHash: passwordHash,
            role: 'CLIENTE',
            nombreApellidos: input.nombreApellidos,
            dni: input.dni,
            fechaNacimiento: new Date(input.fechaNacimiento),
            telefono: input.telefono
        });

        return {
            id: userCreado.id,
            email: userCreado.email,
            role: userCreado.role
        }
    }
}