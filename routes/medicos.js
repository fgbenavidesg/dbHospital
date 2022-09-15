// '/api/medicos/'

const {Router} = require('express');
const { check } = require('express-validator');
const { getMedicos, crearMedicos, actualizarMedicos, BorrarMedicos, getMedicoById } = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const router = Router();

router.get('/',validarJWT,getMedicos);

router.post('/',[validarJWT,

    check('nombre','El nombre del medico es obligatorio').not().isEmpty(),
    check('hospital','El hospital id  debe ser valido').isMongoId(),
    validarCampos],crearMedicos);

router.put('/:id',[
    validarJWT,
    check('nombre','El nombre del medico es obligatorio').not().isEmpty(),
    check('hospital','El hospital id  debe ser valido').isMongoId(),
    validarCampos
],actualizarMedicos);

router.delete('/:id',validarJWT,BorrarMedicos);

router.get('/:id',validarJWT,getMedicoById);

module.exports = router;