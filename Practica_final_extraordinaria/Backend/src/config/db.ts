import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg'; // <-- Importamos la librería nativa de Postgres
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('La variable DATABASE_URL no está configurada en el archivo .env');
}

// 1. Creamos el Pool de conexiones real que necesita el adaptador
const pool = new pg.Pool({ connectionString });

// 2. Le pasamos el pool a PrismaPg
const adapter = new PrismaPg(pool);

// 3. Inicializamos Prisma de forma segura
export const prisma = new PrismaClient({ adapter });

export default prisma;