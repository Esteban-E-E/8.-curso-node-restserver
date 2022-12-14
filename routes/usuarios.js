
const { Router } = require('express');
const { check } = require('express-validator');

// const { isAdminRole, hasRole } = require('../middlewares/validar-roles');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJwt } = require('../middlewares/validar-jwt');

const {
    isAdminRole,
    hasRole,
    validarCampos,
    validarJwt
} = require('../middlewares');

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('role').custom( esRolValido ),
    validarCampos
], usuariosPut );

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y más de 6 letras').isLength( { min: 6} ),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExiste ),
    // check('role', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( esRolValido ),
    validarCampos
], usuariosPost );

router.delete('/:id', [ 
    validarJwt,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete );

router.patch('/', usuariosPatch );


module.exports = router;