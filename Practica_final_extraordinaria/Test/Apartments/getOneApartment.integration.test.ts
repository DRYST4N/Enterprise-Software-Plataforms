import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { setupApartmentRoutes } from '../../Backend/src/Public/Apartments/apartamentos.route.js';
import { GetOneApartment } from '../../Backend/src/Public/Apartments/use-cases/get-one-apartment.js';
import { Apartments } from '../../Backend/src/Public/Apartments/apartment.entity.js';
import type { IApartamentoRepository } from '../../Backend/src/Public/Apartments/apartments.repository.js';

class FakeApartmentRepository implements IApartamentoRepository {
    constructor(private apartments: Apartments[] = []) {}

    async findAll(): Promise<Apartments[]> {
        throw new Error('No implementado en el fake repository.');
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
                getOneApartment: new GetOneApartment(repository),
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

describe('GET /api/apartments/:id (GetOneApartment)', () => {
    it('devuelve 200 con los datos del apartamento solicitado', async () => {
        const apartment = buildApartment({ id: 'apartamento-1' });
        const app = buildApp(new FakeApartmentRepository([apartment]));

        const response = await request(app).get('/api/apartments/apartamento-1');

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: 'apartamento-1',
            nombre: 'Apartamento Centro',
            municipio: 'Salamanca',
            provincia: 'Salamanca',
            precioNoche: 75,
        });
    });

    it('devuelve un error si el apartamento no existe', async () => {
        const app = buildApp(new FakeApartmentRepository([]));

        const response = await request(app).get('/api/apartments/no-existe');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El alojamiento solicitado no existe en el sistema o ha sido borrado.');
    });
});