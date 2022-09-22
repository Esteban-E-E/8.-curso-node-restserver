const { request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJwt = async( req = request, res = response, next ) => {
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'There is not token in the request'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        // leer el usuario con el uid
        const usuario = await Usuario.findById( uid );

        // verificar si uid es undefined
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token is not valid - user is not in DB'
            })
        }

        // verificar si uid es true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token is not valid - user with status: false'
            })
        }

        req.usuario =  usuario;
        // req.uid =  uid;
        // const payload = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        // console.log(payload);

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token not valid'
        })
    }
}

module.exports = {
    validarJwt
}