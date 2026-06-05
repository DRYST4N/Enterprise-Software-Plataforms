import express from 'express';
import cors from 'cors';
import { init } from './dependencies.js';
import { router as AdminRouter } from './Admin/index.js';
import passport from './config/passport.js';

const startAdminAPI = async () => {
    const app = express();

    app.use(passport.initialize());
    app.use(cors());
    app.use(express.json());

    const dependencies = await init();

    app.use("/api/admin", AdminRouter(dependencies.controller));


    app.listen(process.env.ADMIN_PORT, () => {
        console.log(`API DEL ADMINISTRADOR corriendo en el PUERTO ${process.env.ADMIN_PORT}`);
    });
}

startAdminAPI();