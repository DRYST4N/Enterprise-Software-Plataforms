import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { CreateAgencia } from '../../Backend/src/Public/User/usecase/create-agencia.usecase.js';
import { setupAuthRoutes } from '../../Backend/src/Public/User/auth.routes.js';
import type { IAuthRepository, UserWithProfile } from '../../Backend/src/Public/User/auth.repository.js';
import type { User } from '@prisma/client';

class FakeAuthRepository implements IAuthRepository {
    public users: UserWithProfile[] = [];
    private nextId = 1;

    async findByEmail(email: string): Promise<UserWithProfile | null> {
        return this.users.find((user) => user.email === email) ?? null;
    }
    async findById(): Promise<UserWithProfile | null> {
        throw new Error('No implementado en el fake repository.');
    }
    async createCliente(): Promise<User> {
        throw new Error('No implementado en el fake repository.');
    }
    async createAgencia(data: {
        email: string;
        passwordHash: string;
        role: 'AGENCIA';
        razonSocial: string;
        cif: string;
        domicilioSocial: string;
        nombreContacto: string;
        telefono: string;
    }): Promise<User> {
        const user: UserWithProfile = {
            id: `user-${this.nextId++}`,
            email: data.email,
            password: data.passwordHash,
            role: data.role,
            createdAt: new Date(),
            updatedAt: new Date(),
            cliente: null,
            agencia: {
                id: `agencia-${this.nextId}`,
                userId: `user-${this.nextId}`,
                razonSocial: data.razonSocial,
                cif: data.cif,
                domicilioSocial: data.domicilioSocial,
                nombreContacto: data.nombreContacto,
                telefono: data.telefono,
                verificada: false,
                bloqueada: false,
            } as any,
        };
        this.users.push(user);
        return user;
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
                createAgencia: new CreateAgencia(repository),
            },
        },
    };

    app.use('/api/auth', setupAuthRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const validAgencia = {
    email: 'agencia@example.com',
    password: 'password123',
    razonSocial: 'Apartamentos Castilla S.L.',
    cif: 'B12345678',
    domicilioSocial: 'Calle Mayor 1, Salamanca',
    nombreContacto: 'Juan Pérez',
    telefono: '600123456',
};

describe('POST /api/auth/register/agencia (CreateAgencia)', () => {
    let repository: FakeAuthRepository;

    beforeEach(() => {
        repository = new FakeAuthRepository();
    });

    it('registra una nueva agencia y devuelve 201', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/register/agencia')
            .send(validAgencia);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Usuario Agencia registrado con éxito. Pendiente de verificación por el Administrador.');
        expect(response.body.user).toMatchObject({
            email: validAgencia.email,
            role: 'AGENCIA',
        });
        expect(repository.users).toHaveLength(1);
    });

    it('devuelve 400 si la validación del DTO falla', async () => {
        const app = buildApp(repository);
        const { cif, ...invalidAgencia } = validAgencia;

        const response = await request(app)
            .post('/api/auth/register/agencia')
            .send(invalidAgencia);

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.error)).toBe(true);
        expect(response.body.error.length).toBeGreaterThan(0);
    });

    it('devuelve un error si el CIF no tiene un formato válido', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/register/agencia')
            .send({ ...validAgencia, cif: 'B123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El CIF es obligatorio y debe tener un formato válido para operar como agencia.');
    });

    it('devuelve un error si el correo electrónico ya está registrado', async () => {
        const app = buildApp(repository);
        await repository.createAgencia({
            email: validAgencia.email,
            passwordHash: 'hash-existente',
            role: 'AGENCIA',
            razonSocial: validAgencia.razonSocial,
            cif: validAgencia.cif,
            domicilioSocial: validAgencia.domicilioSocial,
            nombreContacto: validAgencia.nombreContacto,
            telefono: validAgencia.telefono,
        });

        const response = await request(app)
            .post('/api/auth/register/agencia')
            .send(validAgencia);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El correo electrónico ya se encuentra registrado.');
    });
});