const { request, response } = require('express');
const jws = require('jsonwebtoken');

const isAdminRole = ( req = request, res = response, next ) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el Rol sin verificar el token primero'
        });        
    }

    const { role, nombre } = req.usuario;

    if ( role !== 'ADMIN_ROLE') {
        return res.status(500).json({
            msg: `${nombre} is not admin - the user can not do this`
        });
    }

    next();
}

const hasRole = ( ...roles ) => {

    return ( req = request, res = response, next ) => {

        // console.log( roles, req.usuario.role ); // Muestra los roles y el rol del usuario
        
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el Rol sin verificar el token primero'
            });        
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: `You need someone of the next rols ${roles}`
            });
            
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}