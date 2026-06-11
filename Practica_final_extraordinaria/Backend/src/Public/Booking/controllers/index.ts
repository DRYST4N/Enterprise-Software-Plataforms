import { CreateReservaController } from "./createReserva.controller.js";
import { GetMisReservasController } from "./getMisReservas.controller.js";

export default (dependencies: any) => {
    return {
        createBooking: CreateReservaController(dependencies),
        getMisReservas: GetMisReservasController(dependencies),
    };
};