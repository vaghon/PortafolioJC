'use strict'
var express = require('express'); //Cargamos express
var router = express.Router(); //Cargamos los metodos Router de Express
var multipart = require('connect-multiparty');


// RUTAS
var ProyectosController = require('../controllers/proyectos');


// CARPETA DE IMAGENES
var multipartMiddleware = multipart({uploadDir: './logo'});
var multipartMiddleware2 = multipart({uploadDir: './svg'});



//Rutas POST
router.post('/save-project', ProyectosController.saveProyecto);
router.post('/logo-project/:id', multipartMiddleware, ProyectosController.uploadLogo);
router.post('/svg-project/:id', multipartMiddleware2, ProyectosController.uploadSVG);


//Rutas GET
router.get('/project/:id', ProyectosController.getProyecto);
router.get('/projects', ProyectosController.getProyectos);
router.get('/get-logo/:logo', ProyectosController.getLogo);
router.get('/get-svg/:svg', ProyectosController.getSVG);


//Rutas PUT
router.put('/project/:id', ProyectosController.updateProyecto);


//Rutas DELETE
router.delete('/project/:id', ProyectosController.deleteProyecto);
router.delete('/delete-logo/:logo', ProyectosController.deleteLogo);
router.delete('/delete-svg/:svg', ProyectosController.deleteSVG);

module.exports = router; //Exportamos las rutas