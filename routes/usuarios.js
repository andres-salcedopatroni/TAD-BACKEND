var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//Mongo
const schema_usuarios=require('../schemas/schema_usuarios');
const usuarios = mongoose.model('Usuarios', schema_usuarios,'Usuarios');
const schema_productos=require('../schemas/schema_productos');
const productos = mongoose.model('Productos', schema_productos,'Productos');
const schema_ventas=require('../schemas/schema_ventas');
const ventas = mongoose.model('Ventas', schema_ventas,'Ventas');


router.get('/mostrar', async function(req, res, next) {
  try{
    const lista_usuarios=await usuarios.find({});
    res.json(lista_usuarios);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

router.get('/obtener/:dni_ruc', async function(req, res, next) {
  try{
    const dni_ruc=req.params.dni_ruc;
    const usuario=await usuarios.findOne({dni_ruc:dni_ruc});
    res.json(usuario);
  }
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});

router.get('/loggear/:correo&:clave', async function(req, res, next) {
  try{
    const correo=req.params.correo;
    const clave=req.params.clave;
    const usuario=await usuarios.findOne({correo:correo,clave:clave});
    if(usuario)
      res.json(usuario);
    else
      res.status(400).json({'mensaje':error})
  }
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});

router.post('/agregar', 
  async function(req, res, next) {
    const fecha = new Date();
    const pedido = req.body;
    try{
      const e = new usuarios({
        nombre: pedido.nombre, 
        clave: pedido.clave,
        correo: pedido.correo,
        celular: pedido.celular,
        fecha: fecha,
        dni_ruc: pedido.dni_ruc,
        tipo: pedido.tipo
      });
      await e.save();
      res.json({'mensaje':'Usuario agregado'});
    }
    catch(error){
      res.status(400).json({'mensaje':error});
    };
  }
);

router.delete('/eliminar_mi_usuario', async function(req, res, next) {
  try{
    const pedido=req.body;
    const session = await mongoose.startSession();
    let error = '';
    await session.withTransaction( async function() {
      try{
        await usuarios.deleteMany({dni_ruc: pedido.dni_ruc},{ session: session });
        await productos.deleteMany({codigo_productor: pedido.dni_ruc},{ session: session });
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
  }
});

//Actualizar Usuario
router.put('/actualizar_usuario', async function(req, res, next) {
  try{
    const usuario_nuevo = req.body.usuario_nuevo;
    const usuario_antiguo = req.body.usuario_antiguo;
    const usuario = await usuarios.findOne({dni_ruc: usuario_antiguo.dni_ruc});
    const mis_productos = await productos.findOne({codigo_productor: usuario_antiguo.dni_ruc});
    const mis_ventas = await ventas.findOne({codigo_productor: usuario_antiguo.dni_ruc});
    const mis_compras = await ventas.findOne({codigo_comprador: usuario_antiguo.dni_ruc});
    const session = await mongoose.startSession();
    let error = '';
    await session.withTransaction( async function() {
      try{
        usuario.nombre = usuario_nuevo.nombre;
        usuario.clave = usuario_nuevo.clave;
        usuario.tipo = usuario_nuevo.tipo;
        usuario.dni_ruc = usuario_nuevo.dni_ruc;
        usuario.correo = usuario_nuevo.correo;
        usuario.celular = usuario_nuevo.celular;
        await usuario.save({session:session});
        if(usuario_nuevo.dni_ruc != usuario_antiguo.dni_ruc){
          for(let mp of mis_productos){
            mp.codigo_productor = usuario_nuevo.dni_ruc;
            await mp.save({session: session});
          }
          for(let mv of mis_ventas){
            mv.codigo_productor = usuario_nuevo.dni_ruc;
            await mv.save({session: session});
          }
          for(let mc of mis_compras){
            mc.codigo_comprador = usuario_nuevo.dni_ruc;
            await mc.save({session: session});
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
      res.json(usuario);
    else
      res.status(400).json({'mensaje':error});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

module.exports = router;
