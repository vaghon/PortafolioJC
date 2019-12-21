const mongoose = require('mongoose');
const usuariosSchema = require('../models/usuarios');

usuariosSchema.statics = {
  create: function (data, cb) {
    const user = new this(data);
    user.save(cb);
  },
  login: function (query, cb) {
    this.find(query, cb);
  }
}

const usuarioModel = mongoose.model('Usuarios', usuariosSchema);
module.exports = usuarioModel;