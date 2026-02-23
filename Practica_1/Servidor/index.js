import express from 'express'

//Intanciamos Express
const app = express();

//Definimos la ruta raiz que devolvera una respuesta basada en texto
app.get('/', (req,res) =>{
    res.send('Soy un servidor respondiendo');
})


//Definimos un puerto 3000 como puerto  de escucha  y mensaje de confirmacion cuando el servidor este levantado.
app.listen(3000, () =>{
    console.log('Servidor escuchando en el puerto 3000');
})