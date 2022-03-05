
const { response } = require('express');
const Usuario  = require('../models/usuario');
const encriptado = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login= async(req, res = response)=>{

    const {email, password} = req.body;


    try {
        
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg:'email no encontrado'
            })
        }
        //verificar contraseña
        const validPassword = encriptado.compareSync(password,usuarioDB.password);
        if(!validPassword){
            return res.status(404).json({
                ok: false,
                msg:'contraseña no validad'
            })
        }
        //generar token

         const token = await generarJWT(usuarioDB.id);   

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado... revisar logs'
        })
    }

}
module.exports = {
    login
}