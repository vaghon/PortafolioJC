'use strict'
var express = require('express'); //Cargamos express
var router = express.Router(); //Cargamos los metodos Router de Express
var multipart = require('connect-multiparty');


// RUTAS
var UsuariosController = require('../controllers/usuarios');


// CARPETA DE IMAGENES
var multipartMiddleware = multipart({uploadDir: './users'});



//Rutas POST
router.post('/register', UsuariosController.RegistroUsuarios);
router.post('/login', UsuariosController.loginUser);
router.post('/image-user/:id', multipartMiddleware, UsuariosController.uploadImage);


//Rutas GET
router.get('/users', UsuariosController.getUsers);
router.get('/user/:id', UsuariosController.getUser);
router.get('/get-image-user/:image', UsuariosController.getImageFile);


//Rutas PUT
router.put('/user/:id', UsuariosController.updateUser);


//Rutas DELETE
router.delete('/user/:id', UsuariosController.deleteUser);
router.delete('/get-image-user/:image', UsuariosController.deleteImage);

module.exports = router; //Exportamos las rutas