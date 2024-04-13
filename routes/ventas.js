var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//Mongo
const schema_ventas=require('../schemas/schema_venta');
const ventas = mongoose.model('Ventas', schema_ventas,'Ventas');

router.get('/obtener/:dni_ruc', async function(req, res, next) {
    try{
      const dni_ruc=req.params.dni_ruc;
      const venta=await ventas.findOne({dni_ruc:dni_ruc});
      res.json(venta);}
    catch(error){
      res.status(400).json({'mensaje':error})
    }
  });

/* GET users listing. */
router.post('/agregar', 
  async function(req, res, next) {
    const fecha = new Date();
    const lista_ventas = req.body.carrito;
    try{
        for(let v of lista_ventas){
            let venta = new ventas({
                codigo_productor: v.codigo_productor,
                nombre_producto: v.nombre_producto,
                codigo_comprador: v.codigo_comprador,
                precio: v.precio,
                fecha: fecha,
              });
            await venta.save();
        }
      res.json({'mensaje':'Usuario agregado'});
    }
    catch(error){
      res.status(400).json({'mensaje':error});
    };
  }
);

module.exports = router;