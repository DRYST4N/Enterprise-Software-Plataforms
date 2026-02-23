import express from 'express';
import path from 'path';

//INstanciamos Express y el middleware de JSON
const app = express()

//Definimos la ruta raiz que devolvera un archivo html como respuesta
//path.json une el directorio con el archivo y path.resolve() devuelve el directorio actual
app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), '/index.html'));
})


//Definimos el puerto 8080 como puerto que escucha y un mensaje de confirmacion cuando el servidor este levantado
app.listen(8080,()=> {
    console.log("Cliente escuchando en el puerto 8080");
})