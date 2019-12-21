'use strict'

var Usuarios = require('../dao/usuarios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey123456';
var fs = require('fs');
var path = require('path');


var controller = {

    // METODO PARA REGISTRAR USUARIO
    RegistroUsuarios: function(req, res) {
      
      const newUser = {
        name: req.body.name,
        nickname: req.body.nickname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
      }
    
      Usuarios.create(newUser, (err, user) => {
        
        if(err && err.code === 11000){
          return res.status(409).send({ message: 'Algo anda mal' });
        }

        if(err){
          return res.status(500).send({ message: 'Error del servidor' });
        }

        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id },
          
          SECRET_KEY, {
            expiresIn: expiresIn
        
        });

        const dataUser = {
          _id: user.id,
          accessToken: accessToken,
          expiresIn: expiresIn

        }

        // response 
        res.send({ dataUser });

      });
    },


    // METODO PARA INICIAR SESIÓN
    loginUser: function(req, res, next){
      
        const userData = {
          email: req.body.email,
          password: req.body.password
        }

        Usuarios.findOne({ email: userData.email }, (err, user) => {

          if (err){

            return res.status(500).send({ message: 'Error del servidor' });

          } 
      
          if (!user){

            //No existe el email
            res.status(409).send({ message: 'Algo anda mal' });

          }else{

            const resultPassword = bcrypt.compareSync(userData.password, user.password);

            if(resultPassword){

              const expiresIn = 24 * 60 * 60;
              const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: expiresIn });
      
              const dataUser = {

                _id: user.id,
                accessToken: accessToken,
                expiresIn: expiresIn
              }

              // response
              res.send({ dataUser });

            }else{

              //Contraseña incorrecta
              res.status(409).send({ message: 'Algo anda mal' });

            }

          }

        });

    },

    
    // METODO PARA MOSTRAR TODOS LOS USUARIOS REGISTRADOS
    getUsers: function(req, res){

      Usuarios.find({}).sort('name').exec((error, users) =>{
        if(error){
          return res.status(500).send({ message: 'Error al devolver los datos' });
        }
        if(!users){
          return res.status(404).send({ message: 'No hay usuarios para mostrar' });
        }
  
        return res.status(200).send({ users });
      });

    },


    // METODO PARA MOSTRAR UN USUARIO
    getUser: function(req, res){
      var userId = req.params.id;
  
      if(userId == null){
        return res.status(404).send({ message: 'El proyecto no existe' });
      }
  
      Usuarios.findById(userId, (err, user) =>{
  
        if(err){
          return res.status(500).send({ message: 'Error al devolver los datos' });
        }
        if(!user){
          return res.status(404).send({ message: 'El usuario no existe' });
        }
  
        return res.status(200).send({ user });
  
      });
    },


    // METODO PARA ACTUALIZAR USUARIO
    updateUser: function(req, res){
      var userId = req.params.id;
      var update = req.body;
      var file = req.body.image;
      var path_Viejo = './users/'+file;
      
  
      Usuarios.findByIdAndUpdate(userId, update, {new:true}, (error, userUpdate) =>{

          if(error && error.code === 11000){
            return res.status(409).send({ message: 'El correo ya existe' });
          }
          if(error){
          return res.status(500).send({ message: 'Error al actualizar' });
          }
          if(!userUpdate){
            return res.status(404).send({ message: 'No hay proyectos para actualizar' });
          }

          if(fs.existsSync(path_Viejo)){

            fs.unlinkSync(path_Viejo);

          } 
  
          return res.status(200).send({ user: userUpdate });
      });
    },
  

    // METODO PARA ELIMINAR USUARIO
    deleteUser: function(req, res){

      var usertId = req.params.id;
      
      Usuarios.findByIdAndDelete(usertId, (error, userDelete) =>{
        if(error){
          return res.status(500).send({ message: 'Error al borrar'  });
        }
        if(!userDelete){
          return res.status(404).send({ message: 'No hay proyectos para borrar' });
        }
        
        return res.status(200).send({ user: userDelete });

      });
    
    },


    // METODO PARA SUBIR IMAGEN DE PERFIL DEL USUARIO
    uploadImage: function(req, res){
      var userId = req.params.id;
      var fileName = 'Imagen no subida...';
  
      if(req.files){
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[1];
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];
  
        if(fileExt == 'png' || fileExt == 'PNG' || fileExt == 'jpg' || fileExt == 'JPG' || fileExt == 'png' || fileExt == 'jpeg' || fileExt == 'JPEG' || fileExt == 'gif' || fileExt == 'GIF'){
          Usuarios.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (error, userUpdate) =>{
  
            if(error){
              return res.status(500).send({ message: 'La imagen no se ha subido' });
            }
            if(!userUpdate){
              return res.status(404).send({ message: 'No hay proyecto para agregarle imagen' });
            }
  
            return res.status(200).send({ user: userUpdate });

          });

        }else{
          fs.unlink(filePath, (error) =>{
            return res.status(200).send({ message: 'La extension no es valida' });
          });
        }
      }else{
        return res.status(200).send({ message: fileName });
      }
    },

    
    // METODO PARA MOSTRAR LA IMAGEN
    getImageFile: function(req, res){
      var file = req.params.image;
      var path_file = './users/'+file;
  
      fs.exists(path_file, (exists) => {
        if(exists){
          return res.sendFile(path.resolve(path_file));
        }else{
          return res.status(200).send({ message: "No existe la imagen" });
        }
      });
    },


    // METODO ELIMINAR IMAGEN
    deleteImage: function(req, res){
      var file = req.params.image;
      var path_file = './users/'+file;

      if(fs.existsSync(path_file)){

        fs.unlinkSync(path_file);

      } 

      return res.status(200).send({ image: path_file });
    }

};

//Exportamos el JSON de metodos o funciones para
module.exports = controller;
