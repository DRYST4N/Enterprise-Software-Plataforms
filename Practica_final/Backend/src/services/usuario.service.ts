import { RegistroDTO } from '../dtos/auth.dto';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

export class UsuarioService{
    static async findByEmail(correo:string){
        return await prisma.usuario.findUnique({
            where: {
                correo
            },
            include:{ cliente: true, empresa: true}
        });
    };
    static async comparePassword(plain: string, hash: string){
        return bcrypt.compare(plain, hash);
    };
    static async registrar(data: RegistroDTO) {
        
        const hashedPassword = await bcrypt.hash(data.pass, 10);

        return await prisma.$transaction( async (tx: Prisma.TransactionClient) => {
            const usuario = await tx.usuario.create({
                data: {
                    correo: data.correo,
                    pass: hashedPassword,
                    role: data.role
                },
            });

            if(data.role === 'Cliente'){
                await tx.cliente.create({
                    data:{
                        nombre_completo: data.nombre_completo!,
                        dni: data.dni!,
                        fecha_nacimiento: data.fecha_nacimiento!,
                        telefono: data.telefono!,
                        usuario_id: usuario.id,
                    },
                });
            } else if(data.role === 'Empresa'){
                await tx.empresa.create({
                    data:{
                        razon_social: data.razon_social!,
                        cif: data.cif!,
                        nombre_empresa: data.nombre_empresa!,
                        domicilio_social:data.domicilio_social!,
                        nombre_contacto:data.nombre_contacto!,
                        telefono_contacto:data.telefono_contacto!,
                        usuario_id: usuario.id,
                    },
                });
            }

            return usuario;
        });
    };


    static async delete(id: number){
        return await prisma.usuario.delete({
            where: {id}
        });
    }
}