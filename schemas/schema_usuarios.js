const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_usuarios= new Schema(
    { 
        nombre: String, 
        clave: {type: String},
        tipo: {type: String},
        dni_ruc: {type: String},
        correo: {type: String, unique: true, required: true},
        celular: {type: Number},
        fecha: Date
    });

module.exports=schema_usuarios