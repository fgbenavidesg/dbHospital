const {Router} = require('express');
const { check } = require('express-validator');
const { login, google } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

///routes/auth
const router = Router();

router.post('/',[
    check('password','El password es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    validarCampos,
],login);

router.post('/google',[
    check('token','El token de google es obligatorio').not().isEmpty(),
    validarCampos,
],google)

module.exports = router;