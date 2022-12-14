const { response } = require('express');
const Categoria = require('../models/categoria')


// obtenerCategorias - paginado - total - populate
const categoriasGet = async( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    // const { q, nombre = "No name", apikey, page = 1, limit = 10} = req.query;

    const [ total, categorias ] = await Promise.all([
        Categoria.count(query),
        Categoria.find(query)
            .populate( 'usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    
    res.json({
        total,
        categorias
    });

}
// obtenerCategoria - populate {}
const obtenerCategoria = async( req, res = response ) => {
    const { id } = req.params;
    const categoria =  await Categoria.findById( id ).populate( 'usuario', 'nombre');

    res.json( categoria );
}

const crearCategoria = async( req, res = response ) => {
    
    // Cambia a mayusculas la categoria
    const nombre = req.body.nombre.toUpperCase();
    
    //Revisar si existe una categoría previa
    const categoriaDB = await Categoria.findOne({nombre});
    
    console.log( categoriaDB );
    
    if ( categoriaDB ) {
        return res.status(400).json({ 
            msg: `La categia ${ categoriaDB.nombre }, ya existe`
        });
    }
    
    
    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    //Lo crea lo prepara pero no lo guarda en DB
    const categoria = new Categoria( data );
    
    // Guardar DB
    await categoria.save();
    // console.log( data );

    res.status(201).json( categoria );
}

// actualizarCategoria 
const actualizarCategoria = async( req, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    //NOMBRE EN UPPERCASE
    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    //responde el json en postman
    res.json( categoria );
}

// borrarCategoria - estado:false
const borrarCategoria = async( req, res = response ) => {

    const { id } = req.params;

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.status(200).json(categoriaBorrada)
}


module.exports = {
    categoriasGet,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}