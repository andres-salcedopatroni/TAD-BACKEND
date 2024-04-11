var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//Mongo
const schema_producto=require('../schemas/schema_producto');
const producto = mongoose.model('Productos', schema_producto,'Productos');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/mostrar', async function(req, res, next) {
    try{
      const lista_productos = await producto.find({});
      res.json(lista_productos);
    }
    catch(error){
      res.status(400).json({'mensaje':error})
    }
});

router.get('/obtener/:codigo', async function(req, res, next) {
    try{
      const codigo=req.params.codigo;
      const p=await producto.findOne({codigo:codigo});
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
        codigo: pedido.codigo_productor+pedido.nombre,
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
      await producto.deleteMany({codigo: pedido.codigo});
      res.json({"mensaje": "Producto eliminado"});
    }
    catch(error){
      res.status(400).json({'mensaje':error})
    }
  });

router.put('/actualizar', async function(req, res, next) {
    try{
      const pedido=req.body;
      const p = await producto.findOne({codigo: pedido.codigo});
      p.nombre = pedido.nombre; 
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