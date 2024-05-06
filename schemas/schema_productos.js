const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_productos= new Schema(
    { 
        nombre: String, 
        imagen: String, 
        codigo_productor: String,
        categoria: String,
        precio: Number,
        unidad: String,
        descuento: String,
        fecha: Date
    });

module.exports=schema_productos