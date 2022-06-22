/*
    api/uploads/
*/

const { Router } = require("express");
const { fileUpload, retornaImagen } = require("../controllers/uploads");
const expressFileUpload = require('express-fileupload');


const router = Router();
router.use(expressFileUpload());

router.put('/:tipo/:id',fileUpload);
router.get('/:tipo/:foto',retornaImagen);

module.exports =router;
