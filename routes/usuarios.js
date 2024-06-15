const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Mongo
const schema_usuarios = require('../schemas/schema_usuarios');
const usuarios = mongoose.model('Usuarios', schema_usuarios,'Usuarios');
const schema_productos = require('../schemas/schema_productos');
const productos = mongoose.model('Productos', schema_productos,'Productos');
const schema_ventas = require('../schemas/schema_ventas');
const ventas = mongoose.model('Ventas', schema_ventas,'Ventas');


//Obtener usuarios
router.get('/obtener_usuarios', async function(req, res, next) {
  try{
    const lista_usuarios = await usuarios.find({},{dni_ruc:1});
    res.json(lista_usuarios);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Obtener usuario
router.get('/obtener_usuario/:dni_ruc', async function(req, res, next) {
  try{
    const dni_ruc = req.params.dni_ruc;
    console.log(dni_ruc)
    const usuario = await usuarios.findOne({dni_ruc:dni_ruc});
    res.json(usuario);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Ingreso usuario
router.get('/loggear/:correo&:clave', async function(req, res, next) {
  try{
    const correo = req.params.correo;
    const clave = req.params.clave;
    const usuario = await usuarios.findOne({correo:correo,clave:clave});
    if(usuario)
      res.json(usuario);
    else
      res.status(400).json({'mensaje':"El usuario no existe"});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Agregar usuario
router.post('/agregar_usuario', async function(req, res, next) {
  const fecha = new Date();
  const usuario = req.body;
  try{
    const usuario_creado = new usuarios({
      imagen: usuario.imagen, 
      nombre: usuario.nombre, 
      clave: usuario.clave,
      descripcion: usuario.descripcion,
      correo: usuario.correo,
      celular: usuario.celular,
      fecha: fecha,
      dni_ruc: usuario.dni_ruc,
      tipo: usuario.tipo
    });
    await usuario_creado.save();
    res.json({'mensaje':'Usuario agregado'});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  };
});

//Eliminar usuario
router.delete('/eliminar_mi_usuario', async function(req, res, next) {
  try{
    const usuario = req.body;
    const session = await mongoose.startSession();
    let error = '';
    await session.withTransaction( async function() {
      try{
        await usuarios.deleteMany({dni_ruc: usuario.dni_ruc},{ session: session });
        await productos.deleteMany({codigo_productor: usuario.dni_ruc},{ session: session });
      }
      catch(err){
        await session.abortTransaction();
        error = err;
      }
    });
    await session.endSession();
    if(error == '')
      res.json({'mensaje':'Usuario eliminado'});
    else
      res.status(400).json({'mensaje':error});
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Actualizar usuario
router.put('/actualizar_mi_usuario', async function(req, res, next) {
  try{
    const usuario_nuevo = req.body.usuario_nuevo;
    const usuario_antiguo = req.body.usuario_antiguo;
    const usuario = await usuarios.findOne({dni_ruc: usuario_antiguo.dni_ruc});
    const mis_productos = await productos.find({codigo_productor: usuario_antiguo.dni_ruc});
    const mis_ventas = await ventas.find({codigo_productor: usuario_antiguo.dni_ruc});
    const mis_compras = await ventas.find({codigo_comprador: usuario_antiguo.dni_ruc});
    const session = await mongoose.startSession();
    let error = '';
    await session.withTransaction( async function() {
      try{
        usuario.imagen = usuario_nuevo.imagen;
        usuario.nombre = usuario_nuevo.nombre;
        usuario.clave = usuario_nuevo.clave;
        usuario.tipo = usuario_nuevo.tipo;
        usuario.descripcion = usuario_nuevo.descripcion;
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
