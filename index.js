const express = require("express");
const { dbConnection } = require("./db/config");
require('dotenv').config();
const cors = require('cors');

//crear el servidor de express
const app = express();
//DOXy2K8tBzgfQPk1
//db_user

//cors config
app.use( cors());
//lectura y parseo del body
app.use(express.json());

//base de datos
dbConnection();
//direcctorio publico
app.use(express.static('public'));
//rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo',require('./routes/busquedas'));
app.use('/api/upload',require('./routes/uploads'));


app.listen(process.env.PORT,() =>{

    console.log('servidor corriendo en el puerto' + process.env.PORT)

})