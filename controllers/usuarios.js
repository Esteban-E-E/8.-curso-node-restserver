const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req, res = response)  => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    // const { q, nombre = "No name", apikey, page = 1, limit = 10} = req.query;

    const [ total, usuarios ] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    
    res.json({
        total,
        usuarios
    });
}
const usuariosPut = async (req, res)  => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //TODO validar contra base de datos
    if (password) {
         //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.status(500).json(usuario);
}
const usuariosPost = async (req, res)  => {
    
    const { nombre, email, password, role} = req.body;

    const usuario = new Usuario( { nombre, email, password, role } );

    //Verificar si el correo existe
    // const existeEmail = await Usuario.findOne({ email });
    // if (existeEmail) {
    //     return res.status(400).json({
    //         msg: "El correo ya está registrado"
    //     });
    // }

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync( password, salt);
    //Guardar en DB
    await usuario.save();
    
    res.status(201).json({
        msg: 'post API - controlador',
        usuario
    });
}
const usuariosDelete = async(req, res)  => {

    const { id } = req.params;

    

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    
    res.json( usuario );
}
const usuariosPatch = (req, res)  => {
    res.json({
        msg: 'patch API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}