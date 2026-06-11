import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { GetInformeVentas } from '../../Backend/src/Public/Apartments/use-cases/get-informe-ventas.js';
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
    constructor(private informe: any[] = []) {}

    async findAll(): Promise<Apartments[]> {
        throw new Error('No implementado en el fake repository.');
    }
    async findById(): Promise<Apartments | null> {
        throw new Error('No implementado en el fake repository.');
    }
    async findByAgencia(): Promise<Apartments[]> {
        throw new Error('No implementado en el fake repository.');
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
        return this.informe;
    }
}

const buildApp = (repository: IApartamentoRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            ApartmentUseCases: {
                getInformeVentas: new GetInformeVentas(repository),
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

describe('GET /api/apartments/informe-venta (GetInformeVentas)', () => {
    it('devuelve 200 con el informe de ventas calculado a partir de las reservas', async () => {
        const informe = [
            {
                id: 'apartamento-1',
                nombre: 'Apartamento Centro',
                municipio: 'Salamanca',
                reservas: [{ precioTotal: 100 }, { precioTotal: 50 }],
            },
            {
                id: 'apartamento-2',
                nombre: 'Apartamento Catedral',
                municipio: 'Ávila',
                reservas: [],
            },
        ];
        const app = buildApp(new FakeApartmentRepository(informe));

        const response = await request(app)
            .get('/api/apartments/informe-venta')
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                apartamentoId: 'apartamento-1',
                nombre: 'Apartamento Centro',
                municipio: 'Salamanca',
                totalVentas: 150,
                totalReservas: 2,
            },
            {
                apartamentoId: 'apartamento-2',
                nombre: 'Apartamento Catedral',
                municipio: 'Ávila',
                totalVentas: 0,
                totalReservas: 0,
            },
        ]);
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app).get('/api/apartments/informe-venta');

        expect(response.status).toBe(401);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol AGENCIA', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app)
            .get('/api/apartments/informe-venta')
            .set('x-mock-user', JSON.stringify(clienteUser));

        expect(response.status).toBe(403);
    });

    it('devuelve un error si el usuario AGENCIA no tiene una agencia asociada', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app)
            .get('/api/apartments/informe-venta')
            .set('x-mock-user', JSON.stringify({ role: 'AGENCIA' }));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No tiene permisos para realizar esta acción.');
    });
});