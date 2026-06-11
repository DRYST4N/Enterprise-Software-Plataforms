import { jest } from '@jest/globals';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'supertest';

import { GetAllAparments } from '../../../Backend/src/Admin/Apartments/usecase/get-all-apartments.usecase.js';
import { UpdateEstrellasUseCase } from '../../../Backend/src/Admin/Apartments/usecase/update-estrellas.js';
import { Apartments } from '../../../Backend/src/Public/Apartments/apartment.entity.js';
import type { IAdminApartmentsRepository } from '../../../Backend/src/Admin/Apartments/admin.apartment.respository.js';

// El middleware de autenticacion real depende de Passport + Prisma, asi que en este
// test de integracion lo sustituimos por uno que lee el usuario desde una cabecera.
jest.unstable_mockModule('../../../Backend/src/middlewares/auth.middlewares.js', () => ({
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

const { RequireAuth, checkRole } = await import('../../../Backend/src/middlewares/auth.middlewares.js');
const { setupAdminApartmentsRouter } = await import('../../../Backend/src/Admin/Apartments/apartments.route.js');

class FakeAdminApartmentRepository implements IAdminApartmentsRepository {
    public apartments: Apartments[] = [];

    async findAllApartments(): Promise<Apartments[]> {
        return this.apartments;
    }
    async updateEstrellasApartments(apartmentId: string, estrellas: number): Promise<Apartments> {
        const apartment = this.apartments.find((a) => a.id === apartmentId);
        if (!apartment) {
            throw new Error('El apartamento solicitado no existe.');
        }
        apartment.estrellas = estrellas;
        return apartment;
    }
}

const buildApp = (repository: IAdminApartmentsRepository) => {
    const app = express();
    app.use(express.json());

    const dependencies = {
        usecases: {
            AdminApartmentUseCases: {
                getAllApartments: new GetAllAparments(repository),
            },
            AdminApartmentsUseCases: {
                updateEstrellas: new UpdateEstrellasUseCase(repository),
            },
        },
    };

    app.use(RequireAuth, checkRole(['ADMIN']));
    app.use('/apartments', setupAdminApartmentsRouter(dependencies));

    return app;
};

const adminUser = { role: 'ADMIN' };
const agenciaUser = { role: 'AGENCIA', agencia: { id: 'agencia-1' } };

const seedApartment = (repository: FakeAdminApartmentRepository) => {
    const apartment = new Apartments({
        id: 'apartamento-1',
        nombre: 'Apartamento Centro',
        descripcion: 'Acogedor apartamento en el centro histórico.',
        municipio: 'Salamanca',
        provincia: 'Salamanca',
        precioNoche: 75,
        agenciaId: 'agencia-1',
    });
    repository.apartments.push(apartment);
    return apartment;
};

describe('PATCH /apartments/:apartamentoId/estrellas (Admin UpdateEstrellas)', () => {
    let repository: FakeAdminApartmentRepository;

    beforeEach(() => {
        repository = new FakeAdminApartmentRepository();
    });

    it('actualiza las estrellas de un apartamento existente', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .patch(`/apartments/${apartment.id}/estrellas`)
            .set('x-mock-user', JSON.stringify(adminUser))
            .send({ estrellas: 4 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Estrellas asignadas con éxito.');
        expect(response.body.apartamento.estrellas).toBe(4);
        expect(repository.apartments[0].estrellas).toBe(4);
    });

    it('devuelve 400 si la valoración está fuera del rango permitido', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .patch(`/apartments/${apartment.id}/estrellas`)
            .set('x-mock-user', JSON.stringify(adminUser))
            .send({ estrellas: 6 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('La valoración debe estar comprendida entre 0 y 5 estrellas.');
    });

    it('devuelve 400 si el apartamento no existe', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .patch('/apartments/no-existe/estrellas')
            .set('x-mock-user', JSON.stringify(adminUser))
            .send({ estrellas: 3 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('El apartamento solicitado no existe.');
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .patch(`/apartments/${apartment.id}/estrellas`)
            .send({ estrellas: 3 });

        expect(response.status).toBe(401);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol ADMIN', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .patch(`/apartments/${apartment.id}/estrellas`)
            .set('x-mock-user', JSON.stringify(agenciaUser))
            .send({ estrellas: 3 });

        expect(response.status).toBe(403);
    });
});