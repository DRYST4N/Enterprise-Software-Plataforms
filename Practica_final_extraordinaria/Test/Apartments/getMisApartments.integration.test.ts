import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { GetMisApartment } from '../../Backend/src/Public/Apartments/use-cases/get-mis-apartments.js';
import { Apartments } from '../../Backend/src/Public/Apartments/apartment.entity.js';
import type { IApartamentoRepository } from '../../Backend/src/Public/Apartments/apartments.repository.js';

// El middleware de autenticacion real depende de Passport + Prisma, asi que en este
// test de integracion lo sustituimos por uno que lee el usuario desde una cabecera.
jest.unstable_mockModule('../../Backend/src/middlewares/auth.middlewares.js', () => ({
    RequireAuth: (req: Request, res: Response, next: NextFunction) => {
        const mockUser = req.header('x-mock-user');
        if (!mockUser) {
            return res.status(401).json({ error: 'No autorizado: Token inválido, expirado o ausente.' });
        }
        (req as any).user = JSON.parse(mockUser);
        next();
    },
    checkRole: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Acceso denegado: No tienes permisos suficientes para realizar esa acción.' });
        }
        next();
    },
}));

const { setupApartmentRoutes } = await import('../../Backend/src/Public/Apartments/apartamentos.route.js');

class FakeApartmentRepository implements IApartamentoRepository {
    constructor(private apartments: Apartments[] = []) {}

    async findAll(): Promise<Apartments[]> {
        throw new Error('No implementado en el fake repository.');
    }
    async findById(): Promise<Apartments | null> {
        throw new Error('No implementado en el fake repository.');
    }
    async findByAgencia(agenciaId: string): Promise<Apartments[]> {
        return this.apartments.filter((apto) => apto.agenciaId === agenciaId);
    }
    async create(): Promise<Apartments> {
        throw new Error('No implementado en el fake repository.');
    }
    async updateEstrellas(): Promise<Apartments> {
        throw new Error('No implementado en el fake repository.');
    }
    async delete(): Promise<Apartments> {
        throw new Error('No implementado en el fake repository.');
    }
    async update(): Promise<Apartments> {
        throw new Error('No implementado en el fake repository.');
    }
    async getInforme(): Promise<any> {
        return [];
    }
}

const buildApp = (repository: IApartamentoRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            ApartmentUseCases: {
                getMisApartments: new GetMisApartment(repository),
            },
        },
    };

    app.use('/api/apartments', setupApartmentRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const agenciaUser = {
    role: 'AGENCIA',
    agencia: { id: 'agencia-1' },
};

const clienteUser = {
    role: 'CLIENTE',
};

const buildApartment = (overrides: Partial<{ id: string; agenciaId: string; nombre: string }> = {}) =>
    new Apartments({
        id: overrides.id ?? 'apartamento-1',
        nombre: overrides.nombre ?? 'Apartamento Centro',
        descripcion: 'Acogedor apartamento en el centro histórico.',
        municipio: 'Salamanca',
        provincia: 'Salamanca',
        precioNoche: 75,
        agenciaId: overrides.agenciaId ?? 'agencia-1',
    });

describe('GET /api/apartments/mis-apartment (GetMisApartment)', () => {
    it('devuelve 200 con los apartamentos de la agencia autenticada', async () => {
        const apartments = [
            buildApartment({ id: 'apartamento-1', agenciaId: 'agencia-1' }),
            buildApartment({ id: 'apartamento-2', agenciaId: 'agencia-1', nombre: 'Apartamento Catedral' }),
            buildApartment({ id: 'apartamento-3', agenciaId: 'agencia-2', nombre: 'Apartamento Otra Agencia' }),
        ];
        const app = buildApp(new FakeApartmentRepository(apartments));

        const response = await request(app)
            .get('/api/apartments/mis-apartment')
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body.map((a: any) => a.id)).toEqual(['apartamento-1', 'apartamento-2']);
    });

    it('devuelve 200 con un array vacío si la agencia no tiene apartamentos', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app)
            .get('/api/apartments/mis-apartment')
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app).get('/api/apartments/mis-apartment');

        expect(response.status).toBe(401);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol AGENCIA', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app)
            .get('/api/apartments/mis-apartment')
            .set('x-mock-user', JSON.stringify(clienteUser));

        expect(response.status).toBe(403);
    });

    it('devuelve un error si el usuario AGENCIA no tiene una agencia asociada', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app)
            .get('/api/apartments/mis-apartment')
            .set('x-mock-user', JSON.stringify({ role: 'AGENCIA' }));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El ID de la agencia es obligatorio');
    });
});