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
    console.log("Prueba")
    const e=await usuarios.find({});
    res.json(e);}
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});


module.exports = router;
