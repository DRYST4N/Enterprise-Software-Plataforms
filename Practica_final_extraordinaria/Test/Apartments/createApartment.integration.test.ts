import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { CreateApartment } from '../../Backend/src/Public/Apartments/use-cases/create-apartment.js';
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
    public created: Apartments[] = [];

    async findAll(): Promise<Apartments[]> {
        return [];
    }
    async findById(): Promise<Apartments | null> {
        return null;
    }
    async findByAgencia(): Promise<Apartments[]> {
        return [];
    }
    async create(data: Omit<Apartments, 'id' | 'createdAt'>): Promise<Apartments> {
        const apartment = new Apartments({ ...data, id: `apartamento-${this.created.length + 1}` });
        this.created.push(apartment);
        return apartment;
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
                createApartment: new CreateApartment(repository),
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

const validApartment = {
    nombre: 'Apartamento Centro',
    descripcion: 'Acogedor apartamento en el centro histórico.',
    municipio: 'Salamanca',
    provincia: 'Salamanca',
    precioNoche: 75,
};

describe('POST /api/apartments (CreateApartment)', () => {
    let repository: FakeApartmentRepository;
    let app: express.Express;

    beforeEach(() => {
        repository = new FakeApartmentRepository();
        app = buildApp(repository);
    });

    it('crea un apartamento y devuelve 201 cuando los datos y el rol son correctos', async () => {
        const response = await request(app)
            .post('/api/apartments')
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send(validApartment);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Apartamento registrado con éxito.');
        expect(response.body.apartamento).toMatchObject({
            nombre: validApartment.nombre,
            municipio: validApartment.municipio,
            provincia: validApartment.provincia,
            precioNoche: validApartment.precioNoche,
            estrellas: 0,
            activo: true,
            agenciaId: agenciaUser.agencia.id,
        });
        expect(repository.created).toHaveLength(1);
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const response = await request(app)
            .post('/api/apartments')
            .send(validApartment);

        expect(response.status).toBe(401);
        expect(repository.created).toHaveLength(0);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol AGENCIA', async () => {
        const response = await request(app)
            .post('/api/apartments')
            .set('x-mock-user', JSON.stringify(clienteUser))
            .send(validApartment);

        expect(response.status).toBe(403);
        expect(repository.created).toHaveLength(0);
    });

    it('devuelve un error si la validación del DTO falla (campo obligatorio ausente)', async () => {
        const { descripcion, ...invalidApartment } = validApartment;

        const response = await request(app)
            .post('/api/apartments')
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send(invalidApartment);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Los datos no son correctos.');
        expect(repository.created).toHaveLength(0);
    });

    it('devuelve un error de negocio si el nombre tiene menos de 3 caracteres', async () => {
        const response = await request(app)
            .post('/api/apartments')
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send({ ...validApartment, nombre: 'Ab' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(' El nombre comercial del apartamento debe tener al menos 3 caracteres.');
        expect(repository.created).toHaveLength(0);
    });
});
