'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProyectosSchema = new Schema({
	name: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
    },
    categoria: {
        type: String,
    },
    tecnologias: {
        type: String,
    },
    logo: String,
    svg: String,
    link: String
},{
        timestamps: true
    });

module.exports = mongoose.model('Proyectos', ProyectosSchema);