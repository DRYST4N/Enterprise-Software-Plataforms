import  cors from 'cors';

const allowedOrigins = ['http://localhost:5173'];

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error('Bloqueado por políticas de CORS de castilla.rooms'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

export default corsMiddleware;