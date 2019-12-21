'use strict'

var mongoose = require('mongoose'); //Libreria Mongoose
var app = require('./app'); //Acceder a nuestra APP donde se configuran las rutas, cors, etc.
var puerto = 3700;

// mongoose.Promise = global.Promise;
// Creamos la conexión a la base de datos de manera de una promesa
mongoose.connect('mongodb://localhost:27017/carlosescobar', {
		useCreateIndex: true, 
		useNewUrlParser: true,
		useFindAndModify: false, 
		useUnifiedTopology: true
	}).then(() => {
		console.log("Conexion a la base de datos con exito...");

		//Creacion del servidor (Esta parte se hace despues de haber creado el app.js que es la configuracion del express)
		app.listen(puerto, () =>{
			console.log("Conexion al servidor correctamente en la url: localhost:3700");
		});
	})
	.catch(error =>{
    	console.log(error);
	});