import express from "express";
import { init } from "./dependencies.js";
import { router as apartmentRouter } from './Apartments/index.js';
import { router as authRouter} from './User/index.js';
import passport from './config/passport.js';
import corsMiddleware from "./config/cors.js";


const startPublicServer = async () => {

    const app = express();

    app.use(express.json());
    app.use(passport.initialize());
    app.use(corsMiddleware);

    const dependencies = await init();


    app.use("/api/apartments", apartmentRouter(dependencies.controller));
    app.use("/api/auth", authRouter(dependencies.controller));
    
    app.get("/api/health", (req, res) => {
        return res.status(200).json({ status: "UP", timestamp: new Date() });
    });

    app.listen(process.env.PORT, () => {
        console.log("El servidor de Castilla Rooms esta corriendo perfectamente.");
    });
};


startPublicServer();