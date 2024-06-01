const express = require('express');
const router = express.Router();
//Mongo
const mongoose = require('mongoose');
const schema_comentarios= require('../schemas/schema_comentarios');
const comentarios = mongoose.model('Comentarios', schema_comentarios,'Comentarios');

//Comentarios de producto
router.get('/comentarios_producto/:nombre&:codigo_productor', async function(req, res, next) {
  try{
    const nombre = req.params.nombre;
    const codigo_productor = req.params.codigo_productor;
    const lista_comentarios = await comentarios.find({nombre_producto: nombre,codigo_productor: codigo_productor});
    res.json(lista_comentarios);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

//Registrar comentario
router.post('/registrar_ventas', async function(req, res, next) {

    try{
        const fecha = new Date();
        const comentario_datos = req.body;
        let comentario = new comentarios({
            contenido: comentario_datos.contenido, 
            nombre_usuario: comentario_datos.nombre_usuario, 
            codigo_usuario: comentario_datos.codigo_usuario,
            nombre_producto: comentario_datos.nombre_producto,
            codigo_productor: comentario_datos.codigo_productor,
            fecha: fecha
        });
        await comentario.save();
        res.json({'mensaje':'Comentario registrado'});
    }
    catch(error){
    res.status(400).json({'mensaje':error});
  };
});

module.exports = router;