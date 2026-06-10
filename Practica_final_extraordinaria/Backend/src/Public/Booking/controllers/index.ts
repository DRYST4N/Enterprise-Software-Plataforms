import { CreateReservaController } from "./createReserva.controller.js";
import { GetMisReservasController } from "./getMisReservas.controller.js";

export const controller = (dependencies: any) => {
    return {
        booking: CreateReservaController(dependencies),
        getMisReservas: GetMisReservasController(dependencies),
    };
};