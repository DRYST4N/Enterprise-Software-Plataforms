import { usecases as ApartmentUseCases, repository as ApartmentRepository } from '../Public/Apartments';
import { usecases as AuthUseCases, repository as AuthRepository } from '../Public/User';
import { usecases as BookingUseCases, repository as BookingRepository } from '../Public/Booking'; 
export default {
    init: async () => {

        return {
            usecases: {
                ApartmentUseCases,
                AuthUseCases,
                BookingUseCases
            },
            repositories: {
                ApartmentRepository,
                AuthRepository,
                BookingRepository
            }
        };
    } 
}