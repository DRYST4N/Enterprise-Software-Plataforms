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
    public shouldThrow = false;

    async findAllApartments(): Promise<Apartments[]> {
        if (this.shouldThrow) {
            throw new Error('Error al recuperar los apartamentos.');
        }
        return this.apartments;
    }
    async updateEstrellasApartments(): Promise<Apartments> {
        throw new Error('No implementado en el fake repository.');
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

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).json({ error: err.message });
    });

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

describe('GET /apartments (Admin GetAllAparments)', () => {
    let repository: FakeAdminApartmentRepository;

    beforeEach(() => {
        repository = new FakeAdminApartmentRepository();
    });

    it('devuelve la lista de todos los apartamentos para un administrador', async () => {
        const apartment = seedApartment(repository);
        const app = buildApp(repository);

        const response = await request(app)
            .get('/apartments')
            .set('x-mock-user', JSON.stringify(adminUser));

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toMatchObject({
            id: apartment.id,
            nombre: apartment.nombre,
            agenciaId: apartment.agenciaId,
        });
    });

    it('devuelve una lista vacía si no hay apartamentos registrados', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/apartments')
            .set('x-mock-user', JSON.stringify(adminUser));

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('devuelve 401 si no se envía un usuario autenticado', async () => {
        const app = buildApp(repository);

        const response = await request(app).get('/apartments');

        expect(response.status).toBe(401);
    });

    it('devuelve 403 si el usuario autenticado no tiene el rol ADMIN', async () => {
        const app = buildApp(repository);

        const response = await request(app)
            .get('/apartments')
            .set('x-mock-user', JSON.stringify(agenciaUser));

        expect(response.status).toBe(403);
    });

    it('propaga el error si el repositorio falla al recuperar los apartamentos', async () => {
        repository.shouldThrow = true;
        const app = buildApp(repository);

        const response = await request(app)
            .get('/apartments')
            .set('x-mock-user', JSON.stringify(adminUser));

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Error al recuperar los apartamentos.');
    });
});