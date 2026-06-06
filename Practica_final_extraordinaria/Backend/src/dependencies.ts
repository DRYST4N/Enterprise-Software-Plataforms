import {
    repository as ApartmentsRepository, 
    usecase as ApartmentsUseCases,
    controller as ApartmentsController 
} from './Apartments/index.js';

import {
    repository as BookingRepository,
    usecase as BookingUseCases,
    controller as BookingController 
} from './Booking/index.js';

import {
    repository as AuthRepository,
    usecase as AuthUsesCases,
    controller as AuthController
} from './User/index.js';

import{
    repository as AdminRepository,
    usecase as AdminUseCase,
    controller as AdminController
} from './Admin/index.js';

import { AxiosPaymentService } from './Frameworks/PaymentService.js';


export const init = async () => {

    //Instanciamos el repositorio
    const apartmentsRepository = new ApartmentsRepository();
    const bookingsRepository = new BookingRepository();
    const authRepository = new AuthRepository();
    const adminRepository = new AdminRepository();

    const paymentService = new AxiosPaymentService();

    //Instanciamos los casos de useo desde el objeto agrupado
    const allUseCases = {
        createApartment: new ApartmentsUseCases.CreateApartment(apartmentsRepository),
        getAllApartment: new ApartmentsUseCases.GetAllAparments(apartmentsRepository),
        GetOneApartment: new ApartmentsUseCases.GetOneApartment(apartmentsRepository),
        updateApartment: new ApartmentsUseCases.UpdateApartment(apartmentsRepository),
        getMisApartments: new ApartmentsUseCases.GetMisApartment(apartmentsRepository),
        deleteApartment: new ApartmentsUseCases.DeleteApartment(apartmentsRepository, bookingsRepository),
        getInformeVentas: new ApartmentsUseCases.GetInformeVentas(apartmentsRepository),

        createCliente: new AuthUsesCases.CreateCliente(authRepository),
        createAgencia: new AuthUsesCases.CreateAgencia(authRepository),
        login: new AuthUsesCases.LoginUseCase(authRepository),
        getMisDatos: new AuthUsesCases.GetMisDatosUseCase(authRepository),
        updateMisDatos: new AuthUsesCases.UpdateMisDatosUseCase(authRepository),

        createReserva: new BookingUseCases.CreateBookingUseCase(bookingsRepository, paymentService),

        verifyAgency: new AdminUseCase.VerifyAgencyUseCase(adminRepository),
        getAllAgencies:new AdminUseCase.GetAllAparments(adminRepository),
        getAllApartmentsAdmin: new AdminUseCase.GetAllAparments(adminRepository),
        updateEstrellas: new AdminUseCase.UpdateEstrellasUseCase(adminRepository),
        getSystemStatus: new AdminUseCase.GetServicesStatusUseCase(),
    }

    const appDependencies = {
        usecase: allUseCases
    }
    
    //Instanciamos el controllador
    const apartamentController = ApartmentsController (appDependencies);
    const authController = AuthController(appDependencies);
    const bookingController = BookingController(appDependencies);
    const adminController = AdminController(appDependencies);

    return {
        usecases: allUseCases,
        repository: {
            apartmentsRepository,
            bookingsRepository,
            authRepository,
            adminRepository
        },
        controller: {
            apartamentController,
            bookingController,
            authController,
            adminController
        }
    };
};