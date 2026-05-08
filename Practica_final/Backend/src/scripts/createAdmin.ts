import prisma from "../lib/prisma";
import bcrypt from 'bcrypt';

async function main() {
    const pass = await bcrypt.hash('admin123', 10);
    await prisma.usuario.create({
        data: {
            correo: 'admin@festio.com',
            pass,
            role:'ADMIN',
        }
    });
    console.log('Admin creado correctamente');
}

main().then(() => process.exit(0));