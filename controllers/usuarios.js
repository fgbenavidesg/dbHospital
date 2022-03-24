const Usuario = require("../models/usuario");
const { response } = require('express');
const encriptado = require('bcryptjs');
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    // const usuario = await Usuario.find({}, 'nombre email role google')
    //                              .skip(desde)
    //                              .limit(5);

    // const total = await Usuario.count();

    const [usuario, total]=await Promise.all([
        
        Usuario
                .find({}, 'nombre email role google img')
                .skip(desde)
                .limit(5),

        Usuario.countDocuments(),
    ]);

    res.json({
        ok: true,
        usuario,
        total
    });

}
const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'el correo ya esta registrado'
            })
        }
        const usuario = new Usuario(req.body);

        const salt = encriptado.genSaltSync();

        usuario.password = encriptado.hashSync(password, salt);

        await usuario.save();

        //generar token

        const token = await generarJWT(usuario.uid);   

        res.json({
            ok: true,
            usuario,
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

const actualizarUsuario = async(req, res= response) =>{

    const uid  = req.params.id;

    try {
      
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'no existe un usuario con ese id'
            })
        }

        //actualizaciones 
        const {password,google,email, ...campos } = req.body;

        
        if(usuarioDB.email !== email){

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'el correo ya esta registrado'
                })
            }
        }

        campos.email = email;
        const usuarioActualizando = await Usuario.findByIdAndUpdate(uid,campos, {new :true});

        res.json({
            ok: true,
            usuario: usuarioActualizando,
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado...'
        })
    }


}
const borrarUsuario = async(req, res = response ) =>{
    const uid = req.params.id;
    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'no existe un usuario con ese id'
            })
        } 
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado...'
        })
    }
}
module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}