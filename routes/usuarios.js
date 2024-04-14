var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//Mongo
const schema_usuarios=require('../schemas/schema_usuarios');
const usuarios = mongoose.model('Usuarios', schema_usuarios,'Usuarios');
const schema_producto=require('../schemas/schema_producto');
const producto = mongoose.model('Productos', schema_producto,'Productos');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/mostrar', async function(req, res, next) {
  try{
    const lista_usuarios=await usuarios.find({});
    res.json(lista_usuarios);}
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});

router.get('/obtener/:dni_ruc', async function(req, res, next) {
  try{
    const dni_ruc=req.params.dni_ruc;
    const usuario=await usuarios.findOne({dni_ruc:dni_ruc});
    res.json(usuario);}
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
        await usuarios.deleteMany({dni_ruc: pedido.dni_ruc});
        await producto.deleteMany({codigo_productor: pedido.dni_ruc});
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

router.put('/actualizar', async function(req, res, next) {
  try{
    const pedido=req.body;
    const e = await usuarios.findOne({dni_ruc: pedido.dni_ruc});
    e.nombre = pedido.nombre;
    e.correo = pedido.correo;
    e.celular = pedido.celular;
    e.tipo = pedido.tipo;
    await e.save();
    res.json({"mensaje": "Estudiante actualizado"});
  }
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});

module.exports = router;
