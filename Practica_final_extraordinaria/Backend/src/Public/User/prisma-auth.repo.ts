import {prisma} from "../../Frameworks/prisma.js";
import type { IAuthRepository, UserWithProfile } from "./auth.repository.js";
import { UserEntity } from "./auth.entity.js";
import type { User } from "@prisma/client";

export class PrismaAuthRepository implements IAuthRepository{
    private profileInclude = {
        cliente: true,
        agencia: true,
    }
    async findByEmail(email: string): Promise<UserWithProfile | null> {
        console.log("[Prisma] Sacando el usuario por email.");
        return await prisma.user.findUnique({
            where: { email },
            include: this.profileInclude
        });
    }
    async findById(id: string): Promise<UserWithProfile | null> {
        console.log("[Prisma] Sacando el usuario por el id.");
        return await prisma.user.findUnique({
            where: { id },
            include: this.profileInclude
        });
    }
    async createCliente(data: {
        email: string;
        passwordHash: string;
        role: 'CLIENTE';
        nombreApellidos: string;
        dni: string;
        fechaNacimiento: Date;
        telefono: string;}): Promise<User> {
        console.log("[Prisma] Insertando usuario base + Cliente en la BD.");
        return await prisma.user.create({
            data: {
                email: data.email,
                password: data.passwordHash,
                role: 'CLIENTE',
                cliente:{
                    create: {
                        nombreApellidos: data.nombreApellidos!,
                        dni: data.dni!,
                        fechaNacimiento: data.fechaNacimiento!,
                        telefono: data.telefono!
                    }
                }
            }
        });
    }

    async createAgencia(data: {
        email: string;
        passwordHash: string;
        role: 'AGENCIA';
        razonSocial: string;
        cif: string;
        domicilioSocial: string;
        nombreContacto: string;
        telefono: string;
    }): Promise<User> {
        console.log("[Prisma] Insertando usuario base + Agencia en la BD.");
        return await prisma.user.create({
            data: {
                email: data.email,
                password: data.passwordHash,
                role: 'AGENCIA',
                agencia: {
                    create:{
                        razonSocial: data.razonSocial!,
                        cif: data.cif!,
                        domicilioSocial: data.domicilioSocial!,
                        nombreContacto: data.nombreContacto!,
                        telefono: data.telefono!,
                        verificada: false,
                        bloqueada: false
                    }
                }
            }
        });
    }

    async updateProfile(id: string, role: string, data: Partial<UserEntity>): Promise<UserWithProfile> {
        console.log("[Prisma] Actualizando sub-perfil del usuario.");

        const updateData: any = {};

        if (role === 'CLIENTE') {
            updateData.cliente = {
                update: {
                    nombreApellidos: data.nombreApellidos,
                    telefono: data.telefono
                }
            };
        }

        if (role === 'AGENCIA') {
            updateData.agencia = {
                update: {
                    razonSocial: data.razonSocial,
                    nombreContacto: data.nombreContacto,
                    telefono: data.telefono,
                    domicilioSocial: data.domicilioSocial
                }
            };
        }

        return await prisma.user.update({
            where: { id },
            data: updateData,
            include: this.profileInclude
        });

    }
}