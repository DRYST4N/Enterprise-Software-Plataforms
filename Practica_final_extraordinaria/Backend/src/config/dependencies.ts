import { usecases as ApartmentUseCases, repository as ApartmentRepository } from '../Public/Apartments';
import { usecases as AuthUseCases, repository as AuthRepository } from '../Public/User';
export default {
    init: async () => {

        return {
            usecases: {
                ApartmentUseCases,
                AuthUseCases,
            },
            repositories: {
                ApartmentRepository,
                AuthRepository,
            }
        };
    } 
}