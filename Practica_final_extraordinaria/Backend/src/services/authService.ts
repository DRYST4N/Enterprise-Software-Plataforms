import bcrypt from 'bcrypt';
import prisma from '../config/db.js';
import { Role } from '@prisma/client';
import type { RegistrarClienteInput, RegistrarAgenciaInput } from '../dtos/authDto.js';
import jwt from 'jsonwebtoken';

export const registrarClientesService = async (data: RegistrarClienteInput) => {
    const userExist = await prisma.user.findUnique({ where: { email: data.email } });
    const clientExist = await prisma.cliente.findUnique({ where: { dni: data.dni } });

    if(userExist || clientExist){
        throw new Error('El correo electrónico o el DNI ya están registrados en la plataforma');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: Role.CLIENTE,
            },
        });
        return await tx.cliente.create({
            data: {
                userId: user.id,
                nombreApellidos: data.nombreApellidos,
                dni: data.dni,
                fechaNacimiento: data.fechaNacimiento,
                telefono: data.telefono,
            },
        });
    });
};

export const registrarAgenciaService = async (data: RegistrarAgenciaInput) => {
    const userExist = await prisma.user.findUnique({ where: {email: data.email } });
    const agenciaExist = await prisma.agencia.findUnique({ where: {cif: data.cif } });

    if (userExist || agenciaExist){
        throw new Error(' El correo electrónico o el CIF ya están registrados en la plataforma');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: Role.AGENCIA,
            },
        });

        return await tx.agencia.create({
            data: {
                userId: user.id,
                razonSocial: data.razonSocial,
                cif: data.cif,
                domicilioSocial: data.domicilioSocial,
                nombreContacto: data.nombreContacto,
                telefono: data.telefono,
                verificada: false,
            },
        });
    });
};


export const loginUserService = async (email: string, passwordInput: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { cliente: true, agencia: true}
    });
    if(!user) {
        throw new Error('Usuario no encontrado.');
    }

    const match = await bcrypt.compare(passwordInput, user.password);
    if(!match){
        throw new Error('Credenciales incorrectas');
    }

    const token = jwt.sign(
        {id:user.id, role:user.role},
        process.env.JWT_Secret || 'super_secret_key_castilla_rooms',
        {expiresIn: '8h' }
    );

    return {
        token,
        user:{
            id: user.id,
            email: user.email,
            role: user.role,
            profile: user.role === Role.CLIENTE ? user.cliente : user.agencia
        }
    };
};