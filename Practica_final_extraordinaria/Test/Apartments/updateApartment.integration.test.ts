import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { UpdateApartment } from '../../Backend/src/Public/Apartments/use-cases/update-apartament.js';
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
    public apartments: Apartments[] = [];

    async findAll(): Promise<Apartments[]> {
        return this.apartments;
    }
    async findById(id: string): Promise<Apartments | null> {
        return this.apartments.find((apto) => apto.id === id) ?? null;
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
    async update(id: string, data: Omit<Apartments, 'id' | 'createdAt' | 'activo' | 'estrellas' | 'agenciaId'>): Promise<Apartments> {
        const apto = this.apartments.find((a) => a.id === id);
        if (!apto) throw new Error('Apartamento no encontrado en el fake repository.');
        apto.nombre = data.nombre;
        apto.municipio = data.municipio;
        apto.provincia = data.provincia;
        apto.precioNoche = data.precioNoche;
        apto.descripcion = data.descripcion;
        return apto;
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
                updateApartment: new UpdateApartment(repository),
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

const validUpdate = {
    nombre: 'Apartamento Centro Reformado',
    descripcion: 'Apartamento totalmente reformado en el centro histórico.',
    municipio: 'Salamanca',
    provincia: 'Salamanca',
    precioNoche: 95,
};

const seedApartment = (repository: FakeApartmentRepository, overrides: Partial<{ id: string; agenciaId: string }> = {}) => {
    const apartment = new Apartments({
        id: overrides.id ?? 'apartamento-1',
        nombre: 'Apartamento Centro',
        descripcion: 'Acogedor apartamento en el centro histórico.',
        municipio: 'Salamanca',
        provincia: 'Salamanca',
        precioNoche: 75,
        agenciaId: overrides.agenciaId ?? 'agencia-1',
    });
    repository.apartments.push(apartment);
    return apartment;
};

describe('PUT /api/apartments/:id (UpdateApartment)', () => {
    let repository: FakeApartmentRepository;

    beforeEach(() => {
        repository = new FakeApartmentRepository();
    });

    it('actualiza el apartamento y devuelve 200 cuando pertenece a la agencia y los datos son correctos', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .put(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send(validUpdate);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Apartamento actualizado con éxito.');
        expect(response.body.apartamento).toMatchObject(validUpdate);
        expect(apartment.nombre).toBe(validUpdate.nombre);
        expect(apartment.precioNoche).toBe(validUpdate.precioNoche);
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .put(`/api/apartments/${apartment.id}`)
            .send(validUpdate);

        expect(response.status).toBe(401);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol AGENCIA', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .put(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify(clienteUser))
            .send(validUpdate);

        expect(response.status).toBe(403);
    });

    it('devuelve un error si la validación del DTO falla (campo obligatorio ausente)', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);
        const { descripcion, ...invalidUpdate } = validUpdate;

        const response = await request(app)
            .put(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send(invalidUpdate);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Los datos no son validos.');
    });

    it('devuelve un error si el apartamento no existe', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .put('/api/apartments/no-existe')
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send(validUpdate);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El alojamiento que intentas modificar no existe.');
    });

    it('devuelve un error si el apartamento pertenece a otra agencia', async () => {
        const apartment = seedApartment(repository, { agenciaId: 'agencia-2' });
        const app = buildApp(repository);

        const response = await request(app)
            .put(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send(validUpdate);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No tienes permisos para modificar este alojamiento.');
        expect(apartment.nombre).not.toBe(validUpdate.nombre);
    });

    it('devuelve un error si el usuario AGENCIA no tiene una agencia asociada', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .put(`/api/apartments/${apartment.id}`)
            .set('x-mock-user', JSON.stringify({ role: 'AGENCIA' }))
            .send(validUpdate);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No autorizado, Inicie sesión como agencia.');
    });
});