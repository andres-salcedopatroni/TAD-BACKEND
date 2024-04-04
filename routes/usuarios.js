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


module.exports = router;
