const { response } = require('express');
const { body } = require('express-validator');
const Producto = require('../models/producto');


// obtenerProducto - paginado - total - populate
const getProducts = async( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    // const { q, nombre = "No name", apikey, page = 1, limit = 10} = req.query;

    const [ total, productos ] = await Promise.all([
        Producto.count(query),
        Producto.find(query)
            .populate( 'usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    
    res.json({
        total,
        productos
    });

}
// obtenerCategoria - populate {}
const obtenerProducto = async( req, res = response ) => {
    const { id } = req.params;
    const producto =  await Producto.findById( id ).populate( 'usuario', 'nombre');

    res.json( producto );
}

const crearProducto = async( req, res = response ) => {
    
    // Cambia a mayusculas la categoria
    const { estado, usuario, ...body } = req.body;
    
    //Revisar si existe una categoría previa
    const productoDB = await Producto.findOne({ nombre: body.nombre });
    
    console.log( productoDB );
    
    if ( productoDB ) {
        return res.status(400).json({ 
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }
    
    
    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    
    //Lo crea lo prepara pero no lo guarda en DB
    const producto = new Producto( data );
    
    // Guardar DB
    await producto.save();
    // console.log( data );

    res.status(201).json( producto );
}

// actualizarCategoria 
const actualizarProducto = async( req, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    //NOMBRE EN UPPERCASE
    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    //responde el json en postman
    res.json( producto );
}

// borrarCategoria - estado:false
const borrarProducto = async( req, res = response ) => {

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.status(200).json(productoBorrado)
}


module.exports = {
    getProducts,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}