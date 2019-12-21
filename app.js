'use strict'

var express = require('express'); //Libreria express
// var bodyParser = require('body-parser'); libreria bodyParser // Desde la versión 4.16 express ya tienne esta función
var app = express(); //Pasando libreria
var path = require('path');


//Cargar archivos de Rutas
var usuarios_rutas = require('./routes/usuarios');
var proyectos_rutas = require('./routes/proyectos');


//Middlewares
app.use(express.urlencoded({limit:'50mb', extended: true})); //Recibir datos por url
app.use(express.json({limit:'50mb'})); //Transformar Datos a JSON


//Cors
app.use((req, res, next) => { //Coniguración de las cabeceras
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});


// Rutas
app.use('/', express.static('client', {redirect: false}));
app.use('/api', usuarios_rutas);
app.use('/api', proyectos_rutas);

app.get('*', function(req, res, next){
	res.sendFile(path.resolve('client/index.html'));

});


//Exportar
module.exports = app; //Para poder usar todo el archivo app.js