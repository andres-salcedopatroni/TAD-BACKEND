const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Mongo
const schema_productos=require('../schemas/schema_productos');
const productos = mongoose.model('Productos', schema_productos,'Productos');
const schema_ventas = require('../schemas/schema_ventas');
const ventas = mongoose.model('Ventas', schema_ventas,'Ventas');

//Obtener productos
router.get('/obtener_productos', async function(req, res, next) {
  try{
    const lista_productos = await productos.find({});
    res.json(lista_productos);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Obtener producto
router.get('/obtener_producto/:nombre&:codigo_productor', async function(req, res, next) {
  try{
    const nombre = req.params.nombre;
    const codigo_productor = req.params.codigo_productor;
    const producto = await productos.findOne({codigo_productor:codigo_productor,nombre:nombre});
    res.json(producto);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Agregar producto
router.post('/agregar_producto', async function(req, res, next) {
  const fecha = new Date();
  const producto = req.body;
  try{
    const nuevo_producto = new productos({
      nombre: producto.nombre,  
      codigo_productor: producto.codigo_productor,
      categoria: producto.categoria,
      precio: producto.precio,
      unidad: producto.unidad,
      descuento: producto.descuento,
      fecha: fecha
    });
    await nuevo_producto.save();
    res.json({'mensaje':'Producto agregado'});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  };
});

//Eliminar producto
router.delete('/eliminar_mi_producto', async function(req, res, next) {
  try{
    const producto = req.body;
    await productos.deleteMany({codigo_productor:producto.codigo_productor,nombre:producto.nombre});
    res.json({"mensaje": "Producto eliminado"});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Actualizar producto
router.put('/actualizar_mi_producto', async function(req, res, next) {
  try{
    const producto_antiguo = req.body.producto_antiguo;
    const producto_nuevo = req.body.producto_nuevo;
    const mi_producto = await productos.findOne({codigo_productor:producto_antiguo.codigo_productor,nombre:producto_antiguo.nombre});
    const ventas_mi_producto = await ventas.find({codigo_productor:producto_antiguo.codigo_productor,nombre_producto:producto_antiguo.nombre});
    const session = await mongoose.startSession();
    let error = '';
    await session.withTransaction( async function() {
      try{
        mi_producto.nombre = producto_nuevo.nombre;
        mi_producto.categoria = producto_nuevo.categoria;
        mi_producto.precio = producto_nuevo.precio;
        mi_producto.unidad = producto_nuevo.unidad;
        mi_producto.descuento = producto_nuevo.descuento;
        await mi_producto.save({session:session});
        if(producto_antiguo.nombre != producto_nuevo.nombre){
          for(let vmp of ventas_mi_producto){
            vmp.nombre_producto = producto_nuevo.nombre;
            await vmp.save({session: session});
          }
        }
      }
      catch(err){
        await session.abortTransaction();
        error = err;
      }
    });
    await session.endSession();
    if(error == '')
      res.json(mi_producto);
    else
      res.status(400).json({'mensaje':error});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

module.exports = router;