'use strict'

var Proyectos = require('../models/proyectos');
var fs = require('fs');
var path = require('path');

var controller = {


    // METODO PARA GUARDAR PROYECTO
    saveProyecto: function(req, res){

        var project = new Proyectos();
        var params = req.body;

        project.name = params.name;
        project.descripcion = params.descripcion;
        project.categoria = params.categoria;
        project.tecnologias = params.tecnologias;
        project.logo = null;
        project.svg = null;
        project.link = params.link;

        project.save((err, projectSave) => {

            if(err){
              return res.status(500).send({ message: 'Error al guardar el documento' });
            } 
            
            if(!projectSave){
              return res.status(404).send({ message: 'No se ha podido guardar el proyecto' });
            }

            return res.status(200).send({ project: projectSave });

        });
    },
    

    // METODO PARA MOSTRAR UN PROYECTO
    getProyecto: function(req, res){
        var projectId = req.params.id;
    
        if(projectId == null){
          return res.status(404).send({ message: 'El proyecto no existe' });
        }
    
        Proyectos.findById(projectId, (err, project) =>{
    
            if(err){
                return res.status(500).send({ message: 'Error al devolver los datos' });
            }

            if(!project){
                return res.status(404).send({ message: 'El proyecto no existe' });
            }
        
            return res.status(200).send({ project });
    
        });
    },


    // METODO PARA MOSTRAR TODOS LOS PROYECTOS REGISTRADOS
    getProyectos: function(req, res){

        Proyectos.find({}).sort('name').exec((error, projects) =>{

            if(error){
                return res.status(500).send({ message: 'Error al devolver los datos' });
            }

            if(!projects){
                return res.status(404).send({ message: 'No hay usuarios para mostrar' });
            }
        
            return res.status(200).send({ projects });

        });
  
    },


    // METODO PARA ACTUALIZAR PROYECTO
    updateProyecto: function(req, res){
        var projectId = req.params.id;
        var update = req.body;


        var file1 = req.body.logo;
        var path_Viejo1 = './logo/'+file1;

        var file2 = req.body.svg;
        var path_Viejo2 = './svg/'+file2;
        
    
        Proyectos.findByIdAndUpdate(projectId, update, {new:true}, (error, projectUpdate) =>{

            if(error){
            return res.status(500).send({ message: 'Error al actualizar' });
            }
            if(!projectUpdate){
              return res.status(404).send({ message: 'No hay proyectos para actualizar' });
            }
  
            if(fs.existsSync(path_Viejo1)){
  
              fs.unlinkSync(path_Viejo1);
  
            }
            
            if(fs.existsSync(path_Viejo2)){
  
              fs.unlinkSync(path_Viejo2);
  
            } 
    
            return res.status(200).send({ project: projectUpdate });
        });
    },


    // METODO PARA ELIMINAR UN PROYECTO
    deleteProyecto: function(req, res){

      var projectId = req.params.id;
      
      Proyectos.findByIdAndDelete(projectId, (error, projectDelete) =>{
        if(error){
          return res.status(500).send({ message: 'Error al borrar'  });
        }
        if(!projectDelete){
          return res.status(404).send({ message: 'No hay proyectos para borrar' });
        }
        
        return res.status(200).send({ projectDelete });

      });
    
    },


    // METODO PARA SUBIR LOGO DEL PROYECTO
    uploadLogo: function(req, res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida...';
    
        if(req.files){
          var filePath = req.files.logo.path;
          var fileSplit = filePath.split('/');
          var fileName = fileSplit[1];
          var extSplit = fileName.split('\.');
          var fileExt = extSplit[1];
    
          if(fileExt == 'png' || fileExt == 'PNG' || fileExt == 'jpg' || fileExt == 'JPG' || fileExt == 'png' || fileExt == 'jpeg' || fileExt == 'JPEG' || fileExt == 'gif' || fileExt == 'GIF' || fileExt == 'svg' || fileExt == 'SVG'){
            Proyectos.findByIdAndUpdate(projectId, {logo: fileName}, {new:true}, (error, projectUpdate) =>{
    
              if(error){
                return res.status(500).send({ message: 'La imagen no se ha subido' });
              }
              if(!projectUpdate){
                return res.status(404).send({ message: 'No hay proyecto para agregarle imagen' });
              }
    
              return res.status(200).send({ projectUpdate });
  
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


    // METODO PARA SUBIR SVG DEL PROYECTO
    uploadSVG: function(req, res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida...';
    
        if(req.files){
          var filePath = req.files.svg.path;
          var fileSplit = filePath.split('/');
          var fileName = fileSplit[1];
          var extSplit = fileName.split('\.');
          var fileExt = extSplit[1];
    
          if(fileExt == 'png' || fileExt == 'PNG' || fileExt == 'jpg' || fileExt == 'JPG' || fileExt == 'png' || fileExt == 'jpeg' || fileExt == 'JPEG' || fileExt == 'gif' || fileExt == 'GIF' || fileExt == 'svg' || fileExt == 'SVG'){
            Proyectos.findByIdAndUpdate(projectId, {svg: fileName}, {new:true}, (error, projectUpdate) =>{
    
              if(error){
                return res.status(500).send({ message: 'La imagen no se ha subido' });
              }
              if(!projectUpdate){
                return res.status(404).send({ message: 'No hay proyecto para agregarle imagen' });
              }
    
              return res.status(200).send({ projectUpdate });
  
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


    // METODO PARA MOSTRAR EL LOGO DEL PROYECTO
    getLogo: function(req, res){
        var file = req.params.logo;
        var path_file = './logo/'+file;
    
        fs.exists(path_file, (exists) => {
          if(exists){
            return res.sendFile(path.resolve(path_file));
          }else{
            return res.status(200).send({ message: "No existe la imagen" });
          }
        });
    },


    // METODO PARA MOSTRAR EL SVG DEL PROYECTO
    getSVG: function(req, res){
        var file = req.params.svg;
        var path_file = './svg/'+file;
    
        fs.exists(path_file, (exists) => {
          if(exists){
            return res.sendFile(path.resolve(path_file));
          }else{
            return res.status(200).send({ message: "No existe la imagen" });
          }
        });
    },


    // METODO ELIMINAR IMAGEN
    deleteLogo: function(req, res){
        var file = req.params.logo;
        var path_file = './logo/'+file;
  
        if(fs.existsSync(path_file)){
  
          fs.unlinkSync(path_file);
  
        } 
  
        return res.status(200).send({ logo: path_file });
    },


    // METODO ELIMINAR IMAGEN
    deleteSVG: function(req, res){
        var file = req.params.svg;
        var path_file = './svg/'+file;
  
        if(fs.existsSync(path_file)){
  
          fs.unlinkSync(path_file);
  
        } 
  
        return res.status(200).send({ svg: path_file });
    },


};

module.exports = controller;