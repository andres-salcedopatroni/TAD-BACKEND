const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_usuarios= new Schema(
    { 
        nombre: String, 
        codigo: {type: String, unique: true, required: true},
        clave: {type: String, required: true},
        correo: {type: String, unique: true, required: true},
        celular: {type: Number, unique: true, required: true},
        fecha: Date
    });

module.exports=schema_usuarios