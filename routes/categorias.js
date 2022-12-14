const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validarJwt, 
    validarCampos,
    isAdminRole 
} = require('../middlewares');

const { login, googleSingIn } = require('../controllers/auth');
const { crearCategoria, 
        categoriasGet, 
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria 
    } = require('../controllers/categorias')

const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/*
{{url}}/api/categorias
*/
// router.get('/', (req, res) => {
//     res.json("Todo OK");
// })

// Obtener todas las categorias - publico
router.get('/', categoriasGet );

// Obtener una categoría por id - publico
router.get('/:id', [
    check( 'id', 'No es un id de Mongo válido' ).isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
] , obtenerCategoria );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
    validarJwt,
    validarCampos
 ], crearCategoria );

// Actualizar - privado - cualquiera con token válido
// Para actualizar un registro por id
router.put('/:id', [
    validarJwt,
    check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);

// Borrar una categoria por id - Admin
router.delete('/:id', [
    validarJwt,
    isAdminRole,
    check( 'id', 'No es un id de Mongo válido' ).isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos    
],borrarCategoria);

module.exports = router;