import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { GetMisDatosUseCase } from '../../Backend/src/Public/User/usecase/get-mis-datos.usecase.js';
import type { IAuthRepository, UserWithProfile } from '../../Backend/src/Public/User/auth.repository.js';
import type { User } from '@prisma/client';

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

const { setupAuthRoutes } = await import('../../Backend/src/Public/User/auth.routes.js');

class FakeAuthRepository implements IAuthRepository {
    public users: UserWithProfile[] = [];

    async findByEmail(): Promise<UserWithProfile | null> {
        throw new Error('No implementado en el fake repository.');
    }
    async findById(id: string): Promise<UserWithProfile | null> {
        return this.users.find((user) => user.id === id) ?? null;
    }
    async createCliente(): Promise<User> {
        throw new Error('No implementado en el fake repository.');
    }
    async createAgencia(): Promise<User> {
        throw new Error('No implementado en el fake repository.');
    }
    async updateProfile(): Promise<UserWithProfile> {
        throw new Error('No implementado en el fake repository.');
    }
}

const buildApp = (repository: IAuthRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            AuthUsecases: {
                getMisDatos: new GetMisDatosUseCase(repository),
            },
        },
    };

    app.use('/api/auth', setupAuthRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const seedCliente = (repository: FakeAuthRepository) => {
    const user: UserWithProfile = {
        id: 'user-cliente-1',
        email: 'cliente@example.com',
        password: 'hash',
        role: 'CLIENTE',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        agencia: null,
        cliente: {
            id: 'cliente-1',
            userId: 'user-cliente-1',
            nombreApellidos: 'María García López',
            dni: '12345678Z',
            fechaNacimiento: new Date('1990-05-15'),
            telefono: '600654321',
        } as any,
    };
    repository.users.push(user);
    return user;
};

const seedAgencia = (repository: FakeAuthRepository) => {
    const user: UserWithProfile = {
        id: 'user-agencia-1',
        email: 'agencia@example.com',
        password: 'hash',
        role: 'AGENCIA',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        cliente: null,
        agencia: {
            id: 'agencia-1',
            userId: 'user-agencia-1',
            razonSocial: 'Apartamentos Castilla S.L.',
            cif: 'B12345678',
            domicilioSocial: 'Calle Mayor 1, Salamanca',
            nombreContacto: 'Juan Pérez',
            telefono: '600123456',
            verificada: true,
            bloqueada: false,
        } as any,
    };
    repository.users.push(user);
    return user;
};

describe('GET /api/auth/me (GetMisDatosUseCase)', () => {
    let repository: FakeAuthRepository;

    beforeEach(() => {
        repository = new FakeAuthRepository();
    });

    it('devuelve los datos del perfil de un cliente autenticado', async () => {
        const user = seedCliente(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .get('/api/auth/me')
            .set('x-mock-user', JSON.stringify({ id: user.id, role: 'CLIENTE' }));

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: user.id,
            email: user.email,
            role: 'CLIENTE',
        });
        expect(response.body.perfil).toMatchObject({
            nombreApellidos: 'María García López',
            dni: '12345678Z',
        });
    });

    it('devuelve los datos del perfil de una agencia autenticada', async () => {
        const user = seedAgencia(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .get('/api/auth/me')
            .set('x-mock-user', JSON.stringify({ id: user.id, role: 'AGENCIA' }));

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: user.id,
            email: user.email,
            role: 'AGENCIA',
        });
        expect(response.body.perfil).toMatchObject({
            razonSocial: 'Apartamentos Castilla S.L.',
            cif: 'B12345678',
        });
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const app = buildApp(repository);

        const response = await request(app).get('/api/auth/me');

        expect(response.status).toBe(401);
    });

    it('devuelve un error si el usuario no existe en el sistema', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/api/auth/me')
            .set('x-mock-user', JSON.stringify({ id: 'no-existe', role: 'CLIENTE' }));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El usuario solicitado no existe en el sistema.');
    });

    it('devuelve un error si el token no contiene el identificador del usuario', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/api/auth/me')
            .set('x-mock-user', JSON.stringify({ role: 'CLIENTE' }));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El identificador del usuario es obligatorio.');
    });
});