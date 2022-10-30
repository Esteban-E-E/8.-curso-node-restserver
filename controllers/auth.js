const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarjwt");
const { googleVerify } = require("../helpers/google.verify");


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

const googleSingIn = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );
        // const googleUser = await googleVerify( id_token );

        // console.log( googleUser );

        let usuario = await Usuario.findOne( {email: correo} );

        if ( !usuario ) {
            // tengo que crearlo

            const data = {
                nombre,
                email: correo,
                password: '>:P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
            
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
        
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSingIn
}