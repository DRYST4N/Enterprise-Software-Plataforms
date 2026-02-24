import express from 'express';
import cors from 'cors';
import factorial  from './functions/factorial.function.js';

//Intanciamos Express
const app = express();
app.use(express.json());
app.use(cors());

//Definimos la ruta raiz que devolvera una respuesta basada en texto
app.get('/', (req,res) =>{
    res.send('Soy un servidor respondiendo');
})

//Definimos la ruta factorial/:num que calculara el factorial del numero dado por parametro.
app.get('/factorial/:num', (req,res) =>{
    const num = Number(req.params.num);

    if(num < 0 || !Number.isInteger(num)){
        return res.status(500).send("El numero debe ser entero")
    }

    res.send(`El factorial de ${num} es ${factorial(num)}`);
})


//Definimos la ruta factorial2/:num que recibe el parametro dentro del body e una peticion .
app.post('/factorial2', (req,res) =>{
    console.log(req.body);
    const status = isNaN(req.body.numero) ? 0 : 1;

    if(status === 0) res.status(500).json({
        status,
        input: req.body.numero,
        result: 'no es un número!'
    })
    else res.status(200).json({
        status,
        input: req.body.numero,
        result: factorial(req.body.numero)
    })
})

//Definimos un puerto 3000 como puerto  de escucha  y mensaje de confirmacion cuando el servidor este levantado.
app.listen(3000, () =>{
    console.log('Servidor escuchando en el puerto 3000');
})