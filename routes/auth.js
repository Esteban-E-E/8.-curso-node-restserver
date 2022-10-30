const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('email', 'The email is required').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validarCampos
], login );

router.post('/google', [
    check('id_token', 'id_token is needed').not().isEmpty(),
    validarCampos
], googleSingIn );

module.exports = router;