var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//Mongo
const schema_usuarios=require('../schemas/schema_usuarios');
const usuarios = mongoose.model('Usuarios', schema_usuarios,'Usuarios');

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

router.get('/obtener/:codigo', async function(req, res, next) {
  try{
    const codigo=req.params.codigo;
    const usuario=await usuarios.findOne({codigo:codigo});
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
        codigo: pedido.dni_ruc,
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

router.delete('/eliminar', async function(req, res, next) {
  try{
    const pedido=req.body;
    await usuarios.deleteMany({codigo: pedido.codigo});
    res.json({"mensaje": "Estudiante eliminado"});
  }
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});

router.put('/actualizar', async function(req, res, next) {
  try{
    const pedido=req.body;
    const e = await usuarios.findOne({codigo: pedido.codigo});
    e.nombre = pedido.nombre;
    e.correo = pedido.correo;
    e.celular = pedido.celular;
    await e.save();
    res.json({"mensaje": "Estudiante actualizado"});
  }
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});

module.exports = router;
