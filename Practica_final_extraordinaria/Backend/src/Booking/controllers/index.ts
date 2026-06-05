import { CreateReservaController } from "./createReserva.controller.js";

export const controller = (dependencies: any) => {
    return {
        booking: CreateReservaController(dependencies),
    };
};