var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UsuariosSchema = new Schema({
  name: {
    type: String, //Tipo de dato
    required: true, //El campo es obligatorio
    trim: true //Los espacios serán eliminados
  },
  nickname: {
    type: String, //Tipo de dato
    required: true, //El campo es obligatorio
    trim: true //Los espacios serán eliminados
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true //El elemento debe ser unico y no repetirse
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  image: String
}, {
    timestamps: true //Guardar la fecha de creación y de actualización
  });

module.exports = UsuariosSchema;