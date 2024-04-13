const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_producto= new Schema(
    { 
        nombre: String, 
        codigo_productor: String,
        categoria: String,
        precio: Number,
        unidad: String,
        descuento: String,
        fecha: Date
    });

module.exports=schema_producto