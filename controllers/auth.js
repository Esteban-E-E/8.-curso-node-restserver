const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarjwt");

// este controlador va en el ../routes/auth/Ln 6, Col 23
const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ email });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'wrong User / password - email'
            });
        }
        //Si el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'wrong User / password - status: false'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'wrong User / password - password'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario, token
            //msg: 'Login ok'
            //, email, password
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Contact you with your admin'
        })
    }

} 

module.exports = {
    login
}