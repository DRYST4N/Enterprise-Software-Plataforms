import { UserEntity } from "./auth.entity.js";
import type { User, Cliente, Agencia } from "@prisma/client";

export type UserWithProfile = User & {
    cliente: Cliente | null;
    agencia: Agencia | null;
}

export interface IAuthRepository {
    findByEmail(email: string): Promise <UserWithProfile | null>;
    findById(id: string): Promise <UserWithProfile | null>;
    createCliente(data:{
        email: string;
        passwordHash: string;
        role: 'CLIENTE';
        nombreApellidos: string;
        dni: string;
        fechaNacimiento: Date;
        telefono: string;
    }): Promise<User>;
    createAgencia(data:{
        email: string;
        passwordHash: string;
        role: 'AGENCIA';
        razonSocial: string;
        cif: string;
        domicilioSocial: string;
        nombreContacto: string;
        telefono: string;
    }): Promise<User>;
    updateProfile(id: string, role: string, data: Partial<UserEntity>): Promise<UserWithProfile>;
}