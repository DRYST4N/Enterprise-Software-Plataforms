import { usecases as ApartmentUseCases, repository as ApartmentRepository } from '../Public/Apartments';
export default {
    init: async () => {

        return {
            usecases: {
                ApartmentUseCases,
            },
            repositories: {
                ApartmentRepository,
            }
        };
    } 
}