import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET ||'mi_clave_super_secreta';

export const register = async (email: string, password: string) => {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {email, password: hashed}
    });
    return {id: user.id, email: user.email, role: user.role};
};

export const login = async(email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if(!user) throw new Error('Usuario no encontrado');

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) throw new Error('Contraseña incorrecta');

    const token = jwt.sign(
        { sub: user.id, role: user.role },
        JWT_SECRET,
        {expiresIn: '24h'}
    );
    
    return { token, user: { id: user.id, email: user.email, role: user.role } };
};