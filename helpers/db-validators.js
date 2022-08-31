const Role = require('../models/role');
const Usuario = require('../models/usuario')


const esRolValido =  async( role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol ${ role } no está en la BD`)
    }
}

const emailExiste = async( email = '' ) => {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El correo ${ email } ya está registrado en la BD`)
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El usuario con el id: ${ id } no existe`)
    }
}



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}