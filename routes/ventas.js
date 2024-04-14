const express = require('express');
const router = express.Router();
//Mongo
const mongoose = require('mongoose');
const schema_ventas = require('../schemas/schema_ventas');
const ventas = mongoose.model('Ventas', schema_ventas,'Ventas');

router.get('/mis_compras/:codigo_comprador', async function(req, res, next) {
  try{
    const codigo_comprador = req.params.codigo_comprador;
    const venta = await ventas.find({codigo_comprador:codigo_comprador});
    res.json(venta);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

router.get('/mis_ventas/:codigo_productor', async function(req, res, next) {
  try{
    const codigo_productor = req.params.codigo_productor;
    const venta = await ventas.find({codigo_productor:codigo_productor});
    res.json(venta);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

router.post('/registrar_ventas', async function(req, res, next) {
  const fecha = new Date();
  const lista_ventas = req.body.carrito;
  try{
    const session = await mongoose.startSession();
    let error = '';
    await session.withTransaction( async function() {
      try{
        for(let v of lista_ventas){
          let venta = new ventas({
            codigo_productor: v.codigo_productor,
            nombre_producto: v.nombre_producto,
            codigo_comprador: v.codigo_comprador,
            precio: v.precio,
            fecha: fecha,
          });
          await venta.save({ session: session });
        }
      }
      catch(err){
        await session.abortTransaction();
        error = err;
      }
    });
    await session.endSession();
    if(error == '')
      res.json({'mensaje':'Usuario agregado'});
    else
      res.status(400).json({'mensaje':error});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  };
});

module.exports = router;