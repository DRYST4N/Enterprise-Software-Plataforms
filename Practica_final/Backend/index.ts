import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import festivarRoute from './routes/festival.route';

const app = express();

app.use(cors);
app.use(express.json());

app.use('/api/festivales', festivarRoute);


const PORT = 3000;
app.listen(PORT, () =>{
    console.log('Servidor corriendo perfectamente')
});