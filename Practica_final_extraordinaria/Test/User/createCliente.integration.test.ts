import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { CreateCliente } from '../../Backend/src/Public/User/usecase/create-cliente.usecase.js';
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
    async createCliente(data: {
        email: string;
        passwordHash: string;
        role: 'CLIENTE';
        nombreApellidos: string;
        dni: string;
        fechaNacimiento: Date;
        telefono: string;
    }): Promise<User> {
        const user: UserWithProfile = {
            id: `user-${this.nextId++}`,
            email: data.email,
            password: data.passwordHash,
            role: data.role,
            createdAt: new Date(),
            updatedAt: new Date(),
            agencia: null,
            cliente: {
                id: `cliente-${this.nextId}`,
                userId: `user-${this.nextId}`,
                nombreApellidos: data.nombreApellidos,
                dni: data.dni,
                fechaNacimiento: data.fechaNacimiento,
                telefono: data.telefono,
            } as any,
        };
        this.users.push(user);
        return user;
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
                createCliente: new CreateCliente(repository),
            },
        },
    };

    app.use('/api/auth', setupAuthRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
};

const validCliente = {
    email: 'cliente@example.com',
    password: 'password123',
    nombreApellidos: 'María García López',
    dni: '12345678Z',
    telefono: '600654321',
    fechaNacimiento: '1990-05-15',
};

describe('POST /api/auth/register/client (CreateCliente)', () => {
    let repository: FakeAuthRepository;

    beforeEach(() => {
        repository = new FakeAuthRepository();
    });

    it('registra un nuevo cliente y devuelve 201', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/register/client')
            .send(validCliente);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Usuario Cliente registrado con éxito.');
        expect(response.body.user).toMatchObject({
            email: validCliente.email,
            role: 'CLIENTE',
        });
        expect(repository.users).toHaveLength(1);
    });

    it('devuelve 400 si la validación del DTO falla', async () => {
        const app = buildApp(repository);
        const { dni, ...invalidCliente } = validCliente;

        const response = await request(app)
            .post('/api/auth/register/client')
            .send(invalidCliente);

        expect(response.status).toBe(400);
        expect(Array.isArray(response.body.errors)).toBe(true);
        expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('devuelve un error si el correo electrónico ya está registrado', async () => {
        const app = buildApp(repository);
        await repository.createCliente({
            email: validCliente.email,
            passwordHash: 'hash-existente',
            role: 'CLIENTE',
            nombreApellidos: validCliente.nombreApellidos,
            dni: validCliente.dni,
            fechaNacimiento: new Date(validCliente.fechaNacimiento),
            telefono: validCliente.telefono,
        });

        const response = await request(app)
            .post('/api/auth/register/client')
            .send(validCliente);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El correo electrónico ya se encuantra registrado.');
    });

    it('devuelve un error si el nombre y apellidos son demasiado cortos', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .post('/api/auth/register/client')
            .send({ ...validCliente, nombreApellidos: 'Jo' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Es obligatorio aportar nombre y apellidos válidos.');
    });
});