const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_venta= new Schema(
    { 
        codigo_productor: String,
        nombre_producto: String,
        codigo_comprador: String,
        precio: Number,
        fecha: Date
    });

module.exports=schema_venta