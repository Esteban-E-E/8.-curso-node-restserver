const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');


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

// Validadores de categorias
const existeCategoriaPorId = async( id ) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id: ${ id } no existe`)
    }
}

// Validadores de productos
const existeProductoPorId = async( id ) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id: ${ id } no existe`)
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}