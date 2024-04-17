const express = require('express');
const router = express.Router();
//Mongo
const mongoose = require('mongoose');
const schema_ventas = require('../schemas/schema_ventas');
const ventas = mongoose.model('Ventas', schema_ventas,'Ventas');

//Mis compras
router.get('/mis_compras/:codigo_comprador', async function(req, res, next) {
  try{
    const codigo_comprador = req.params.codigo_comprador;
    const lista_ventas = await ventas.find({codigo_comprador:codigo_comprador});
    res.json(lista_ventas);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Mis ventas
router.get('/mis_ventas/:codigo_productor', async function(req, res, next) {
  try{
    const codigo_productor = req.params.codigo_productor;
    const lista_ventas = await ventas.find({codigo_productor:codigo_productor});
    res.json(lista_ventas);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Registrar ventas
router.post('/registrar_ventas', async function(req, res, next) {
  const fecha = new Date();
  const lista_ventas = req.body.carrito;
  try{
    const session = await mongoose.startSession();
    let error = '';
    await session.withTransaction( async function() {
      try{
        for(let lv of lista_ventas){
          let venta = new ventas({
            codigo_productor: lv.codigo_productor,
            nombre_producto: lv.nombre_producto,
            codigo_comprador: lv.codigo_comprador,
            precio: lv.precio,
            cantidad: lv.cantidad,
            fecha: fecha,
          });
          await venta.save({session:session});
        }
      }
      catch(err){
        await session.abortTransaction();
        error = err;
      }
    });
    await session.endSession();
    if(error == '')
      res.json({'mensaje':'Ventas registradas'});
    else
      res.status(400).json({'mensaje':error});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  };
});

module.exports = router;