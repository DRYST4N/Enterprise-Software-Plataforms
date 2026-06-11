import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import bcrypt from 'bcrypt';

import { LoginUseCase } from '../../Backend/src/Public/User/usecase/login.usecase.js';
import { setupAuthRoutes } from '../../Backend/src/Public/User/auth.routes.js';
import type { IAuthRepository, UserWithProfile } from '../../Backend/src/Public/User/auth.repository.js';
import type { User } from '@prisma/client';

class FakeAuthRepository implements IAuthRepository {
    public users: UserWithProfile[] = [];

    async findByEmail(email: string): Promise<UserWithProfile | null> {
        return this.users.find((user) => user.email === email) ?? null;
    }
    async findById(): Promise<UserWithProfile | null> {
        throw new Error('No implementado en el fake repository.');
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
                login: new LoginUseCase(repository),
            },
        },
    };

    app.use('/api/auth', setupAuthRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const PASSWORD = 'password123';

const seedCliente = async (repository: FakeAuthRepository) => {
    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    const user: UserWithProfile = {
        id: 'user-cliente-1',
        email: 'cliente@example.com',
        password: passwordHash,
        role: 'CLIENTE',
        createdAt: new Date(),
        updatedAt: new Date(),
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

const seedAgencia = async (repository: FakeAuthRepository, bloqueada = false) => {
    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    const user: UserWithProfile = {
        id: 'user-agencia-1',
        email: 'agencia@example.com',
        password: passwordHash,
        role: 'AGENCIA',
        createdAt: new Date(),
        updatedAt: new Date(),
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
            bloqueada,
        } as any,
    };
    repository.users.push(user);
    return user;
};

describe('POST /api/auth/login (LoginUseCase)', () => {
    let repository: FakeAuthRepository;

    beforeEach(() => {
        repository = new FakeAuthRepository();
    });

    it('inicia sesión correctamente como cliente y devuelve un token', async () => {
        await seedCliente(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'cliente@example.com', password: PASSWORD });

        expect(response.status).toBe(200);
        expect(typeof response.body.token).toBe('string');
        expect(response.body.user).toMatchObject({
            email: 'cliente@example.com',
            role: 'CLIENTE',
            nombre: 'María García López',
        });
    });

    it('inicia sesión correctamente como agencia y devuelve la razón social como nombre', async () => {
        await seedAgencia(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'agencia@example.com', password: PASSWORD });

        expect(response.status).toBe(200);
        expect(response.body.user).toMatchObject({
            email: 'agencia@example.com',
            role: 'AGENCIA',
            nombre: 'Apartamentos Castilla S.L.',
        });
    });

    it('devuelve un error si falta el email o la contraseña', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'cliente@example.com' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El email y la contraseña son datos obligatorios.');
    });

    it('devuelve un error si el usuario no existe', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'noexiste@example.com', password: PASSWORD });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Las credenciales introducidas no son correctas.');
    });

    it('devuelve un error si la contraseña es incorrecta', async () => {
        await seedCliente(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'cliente@example.com', password: 'contraseña-incorrecta' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Las credenicales introducidas no son correctas.');
    });

    it('devuelve un error si la cuenta de agencia está bloqueada', async () => {
        await seedAgencia(repository, true);
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'agencia@example.com', password: PASSWORD });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Esa cuenta de agencia se encuentra bloqueada por el Administrador.');
    });
});