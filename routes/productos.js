var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//Mongo
const schema_productos=require('../schemas/schema_productos');
const producto = mongoose.model('Productos', schema_productos,'Productos');

router.get('/mostrar', async function(req, res, next) {
    try{
      const lista_productos = await producto.find({});
      res.json(lista_productos);
    }
    catch(error){
      res.status(400).json({'mensaje':error})
    }
});

router.get('/obtener/:nombre&:codigo_productor', async function(req, res, next) {
    try{
      const nombre=req.params.nombre;
      const codigo_productor=req.params.codigo_productor;
      const p=await producto.findOne({codigo_productor:codigo_productor,nombre:nombre});
      res.json(p);}
    catch(error){
      res.status(400).json({'mensaje':error})
    }
});

router.post('/agregar', 
  async function(req, res, next) {
    const fecha = new Date();
    const pedido = req.body;
    try{
      const p = new producto({
        nombre: pedido.nombre,  
        codigo_productor: pedido.codigo_productor,
        categoria: pedido.categoria,
        precio: pedido.precio,
        unidad: pedido.unidad,
        descuento: pedido.descuento,
        fecha: fecha
      });
      await p.save();
      res.json({'mensaje':'Producto agregado'});
    }
    catch(error){
      res.status(400).json({'mensaje':error});
    };
  }
);

router.delete('/eliminar', async function(req, res, next) {
    try{
      const pedido=req.body;
      await producto.deleteMany({codigo_productor: pedido.codigo_productor, nombre: pedido.nombre});
      res.json({"mensaje": "Producto eliminado"});
    }
    catch(error){
      res.status(400).json({'mensaje':error})
    }
  });

router.put('/actualizar', async function(req, res, next) {
    try{
      const pedido=req.body;
      const p = await producto.findOne({codigo_productor: pedido.codigo_productor, nombre: pedido.nombre});
      p.categoria = pedido.categoria,
      p.precio = pedido.precio,
      p.unidad = pedido.unidad,
      p.descuento = pedido.descuento,
      await p.save();
      res.json({"mensaje": "Estudiante actualizado"});
    }
    catch(error){
      res.status(400).json({'mensaje':error})
    }
  });

module.exports = router;