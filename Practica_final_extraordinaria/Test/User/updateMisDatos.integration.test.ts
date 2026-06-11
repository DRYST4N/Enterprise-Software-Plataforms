import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { UpdateMisDatosUseCase } from '../../Backend/src/Public/User/usecase/update-mis-datos.usecase.js';
import { UserEntity } from '../../Backend/src/Public/User/auth.entity.js';
import type { IAuthRepository, UserWithProfile } from '../../Backend/src/Public/User/auth.repository.js';

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
    async createCliente(): Promise<any> {
        throw new Error('No implementado en el fake repository.');
    }
    async createAgencia(): Promise<any> {
        throw new Error('No implementado en el fake repository.');
    }
    async updateProfile(id: string, role: string, data: Partial<UserEntity>): Promise<UserWithProfile> {
        const user = this.users.find((u) => u.id === id);
        if (!user) throw new Error('Usuario no encontrado en el fake repository.');

        if (role === 'CLIENTE' && user.cliente) {
            if (data.nombreApellidos !== undefined) (user.cliente as any).nombreApellidos = data.nombreApellidos;
            if (data.telefono !== undefined) (user.cliente as any).telefono = data.telefono;
        }

        if (role === 'AGENCIA' && user.agencia) {
            if (data.razonSocial !== undefined) (user.agencia as any).razonSocial = data.razonSocial;
            if (data.nombreContacto !== undefined) (user.agencia as any).nombreContacto = data.nombreContacto;
            if (data.telefono !== undefined) (user.agencia as any).telefono = data.telefono;
            if (data.domicilioSocial !== undefined) (user.agencia as any).domicilioSocial = data.domicilioSocial;
        }

        return user;
    }
}

const buildApp = (repository: IAuthRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            AuthUsecases: {
                updateMisDatos: new UpdateMisDatosUseCase(repository),
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

describe('PUT /api/auth/me (UpdateMisDatosUseCase)', () => {
    let repository: FakeAuthRepository;

    beforeEach(() => {
        repository = new FakeAuthRepository();
    });

    it('actualiza el perfil de un cliente y devuelve 200', async () => {
        const user = seedCliente(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .put('/api/auth/me')
            .set('x-mock-user', JSON.stringify({ id: user.id, role: 'CLIENTE' }))
            .send({ nombreApellidos: 'María García Pérez', telefono: '699111222' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Perfil actualizado con éxito.');
        expect(response.body.user).toMatchObject({
            id: user.id,
            email: user.email,
            role: 'CLIENTE',
        });
        expect(response.body.user.perfil).toMatchObject({
            nombreApellidos: 'María García Pérez',
            telefono: '699111222',
        });
    });

    it('actualiza el perfil de una agencia y devuelve 200', async () => {
        const user = seedAgencia(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .put('/api/auth/me')
            .set('x-mock-user', JSON.stringify({ id: user.id, role: 'AGENCIA' }))
            .send({ razonSocial: 'Nueva Razón Social S.L.', nombreContacto: 'Ana López', telefono: '699333444', domicilioSocial: 'Calle Nueva 2, León' });

        expect(response.status).toBe(200);
        expect(response.body.user.perfil).toMatchObject({
            razonSocial: 'Nueva Razón Social S.L.',
            nombreContacto: 'Ana López',
            telefono: '699333444',
            domicilioSocial: 'Calle Nueva 2, León',
        });
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .put('/api/auth/me')
            .send({ nombreApellidos: 'Nuevo Nombre' });

        expect(response.status).toBe(401);
    });

    it('devuelve un error si el nombre y apellidos del cliente son demasiado cortos', async () => {
        const user = seedCliente(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .put('/api/auth/me')
            .set('x-mock-user', JSON.stringify({ id: user.id, role: 'CLIENTE' }))
            .send({ nombreApellidos: 'Jo' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El nombre y apellidos deben tener al menos 4 caracteres.');
    });

    it('devuelve un error si la razón social de la agencia está vacía', async () => {
        const user = seedAgencia(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .put('/api/auth/me')
            .set('x-mock-user', JSON.stringify({ id: user.id, role: 'AGENCIA' }))
            .send({ razonSocial: ' ' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('La razón social no puede estar vacía.');
    });
});