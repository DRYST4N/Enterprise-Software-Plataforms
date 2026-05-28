import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt'; // <-- Importamos bcrypt nativo
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Limpiando intentos anteriores...');
  // Borramos el registro viejo por si acaso existía con la clave corrupta
  await prisma.user.deleteMany({ where: { email: 'admin@rooms.com' } });

  console.log('⏳ Encriptando contraseña en caliente...');
  // Encriptamos '123456' usando exactamente el mismo método que tu registro
  const passwordHasheada = await bcrypt.hash('123456', 10);

  console.log('🚀 Insertando nuevo Administrador Oficial...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@rooms.com',
      password: passwordHasheada, // Metemos el hash fresco generado por tu entorno
      role: 'ADMIN'
    }
  });

  console.log('✅ ¡Administrador creado con éxito!');
  console.log('📧 Usuario:', admin.email);
  console.log('🔑 Contraseña en texto plano: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e.message);
  })
  .finally(async () => {
    await pool.end();
  });