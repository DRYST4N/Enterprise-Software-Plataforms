import express from "express";
import type { Express } from "express";
import { Server } from "http"; // Importamos el tipo para el servidor HTTP
import publicRouter  from './Public/routes.js';
import passport from './config/passport.js';
import corsMiddleware from "./config/cors.js";


// Declaramos las variables con sus tipos correctos en TypeScript (pueden ser su tipo o null)
let app: Express | null = null;
let server: Server | null = null;

export default {
    start: async (dependencies: any): Promise<void> => {
        app = express();

        app.use(express.json());
        app.use(passport.initialize());
        app.use(corsMiddleware);

        app.use("/api", publicRouter(dependencies));
        // y otro de admin
        //app.use("/api/auth", authRouter(dependencies.controller));
        
        app.get("/api/health", (req, res) => {
            return res.status(200).json({ status: "UP", timestamp: new Date() });
        });

        const port = process.env.PORT || 3000;
        
        // Guardamos la instancia del servidor HTTP que devuelve .listen()
        server = app.listen(port, () => {
            console.log(`El servidor de Castilla Rooms esta corriendo perfectamente en el puerto ${port}.`);
        });
    },
    stop: async (): Promise<void> => {
        // Cerramos el servidor HTTP de forma segura
        if (server) {
            return new Promise((resolve, reject) => {
                server!.close((err) => {
                    if (err) {
                        console.error("Error al cerrar el servidor:", err);
                        return reject(err);
                    }
                    console.log("Servidor de Castilla Rooms cerrado limpiamente.");
                    resolve();
                });
            });
        }
    }
}