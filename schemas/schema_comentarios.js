const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_comentarios= new Schema(
    { 
        contenido: String, 
        nombre_usuario: String, 
        codigo_usuario: String,
        nombre_producto: String,
        codigo_productor: String,
        fecha: Date 
    });

module.exports=schema_comentarios