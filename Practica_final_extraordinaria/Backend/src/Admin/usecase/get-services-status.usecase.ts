import axios from 'axios';
import { timeStamp } from 'node:console';

export class GetServicesStatusUseCase {
    private readonly PUBLIC_API_URL = "http://localhost:3000/api/health";
    private readonly PAYMENT_API_URL = "http://localhost:5000/api/health";

    async exetur(){
        console.log("[ADMIN Use Case] Verificando el estado de salud de los servicios...");

        const axiosConfig = { timeout: 2000 };

        const  [ publicCheck, paymentCheck ] = await  Promise.allSettled([
            axios.get(this.PUBLIC_API_URL, axiosConfig),
            axios.get(this.PAYMENT_API_URL, axiosConfig)
        ]);

        return {
            apiPublic:{
                name: "API Pública (Puerto 3000)",
                status: publicCheck.status === 'fulfilled' ? "ONLINE" : "OFFLINE",
                message: publicCheck.status === "fulfilled" ? "Operando con normalidad" : "Sin respuesta. Requiere revisión o reinicio."
            },
            apiPagos: {
                name: "API Microservicio de Pago (Puerto 5000)",
                status: paymentCheck.status === "fulfilled" ? "ONLINE" : "OFFLINE",
                message: paymentCheck.status === "fulfilled" ? "Operando con normalidad" : "Sin respuesta. Requiere revision o reinicio."
            },
            timestamp: new Date()
        };
    }
}