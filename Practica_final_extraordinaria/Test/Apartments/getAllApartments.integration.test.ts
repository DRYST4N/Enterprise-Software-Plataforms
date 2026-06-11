import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { setupApartmentRoutes } from '../../Backend/src/Public/Apartments/apartamentos.route.js';
import { GetAllAparments } from '../../Backend/src/Public/Apartments/use-cases/get-all-apartments.js';
import { Apartments } from '../../Backend/src/Public/Apartments/apartment.entity.js';
import type { IApartamentoRepository } from '../../Backend/src/Public/Apartments/apartments.repository.js';

class FakeApartmentRepository implements IApartamentoRepository {
    constructor(private apartments: Apartments[] = [], private error: Error | null = null) {}

    async findAll(): Promise<Apartments[]> {
        if (this.error) throw this.error;
        return this.apartments;
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
        return [];
    }
}

const buildApp = (repository: IApartamentoRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            ApartmentUseCases: {
                getAllApartments: new GetAllAparments(repository),
            },
        },
    };

    app.use('/api/apartments', setupApartmentRoutes(dependencies));

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

    return app;
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

describe('GET /api/apartments (GetAllAparments)', () => {
    it('devuelve 200 con la lista de apartamentos registrados', async () => {
        const apartments = [
            buildApartment({ id: 'apartamento-1', nombre: 'Apartamento Centro' }),
            buildApartment({ id: 'apartamento-2', nombre: 'Apartamento Catedral', agenciaId: 'agencia-2' }),
        ];
        const app = buildApp(new FakeApartmentRepository(apartments));

        const response = await request(app).get('/api/apartments');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toMatchObject({ id: 'apartamento-1', nombre: 'Apartamento Centro' });
        expect(response.body[1]).toMatchObject({ id: 'apartamento-2', nombre: 'Apartamento Catedral' });
    });

    it('devuelve 200 con un array vacío cuando no hay apartamentos registrados', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app).get('/api/apartments');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('propaga el error si el repositorio falla al obtener los apartamentos', async () => {
        const app = buildApp(new FakeApartmentRepository([], new Error('Error al consultar la base de datos.')));

        const response = await request(app).get('/api/apartments');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Error al consultar la base de datos.');
    });
});