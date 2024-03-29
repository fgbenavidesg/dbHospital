
const { response } = require('express');
const Usuario = require('../models/usuario');
const encriptado = require('bcryptjs');
const { verify } = require('../helpers/google-verify');
const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    const { email, password } = req.body;
    try {

        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            })
        }
        //verificar contraseña
        const validPassword = encriptado.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'contraseña no validad'
            })
        }
        //generar token

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token,
            menu:getMenuFrontEnd(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error inesperado... revisar logs'
        })
    }

}

const google = async (req, res = response) => {

    const googletoken = req.body.token;
    try {
        const { name, email, picture } = await verify(googletoken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true,
            });
        } else {
            usuario = usuarioDB;
            usuario.password = '@@@';
            usuario.google = true;
        }

        //guardar en db
        await usuario.save();
        //generar el token - jwt
        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            token,
            menu:getMenuFrontEnd(usuario.role)
        });

    } catch (error) {
        console.log(error)
        res.status(401).json({
            ok: false,
            msg: 'token no es valido'
        })
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const token = await generarJWT(uid);

    try {
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            res.status(404).json({
                ok:false,
                msg:'usuario con id no encontrado'
            });
        }
        res.json({
            ok: true,
            token,
            usuario,
            menu:getMenuFrontEnd(usuario.role)
        })

    } catch (error) {
        console.log(error)
        res.status(401).json({
            ok: false,
            msg: 'consultar con el administrador'
        })
    }

}

module.exports = {
    login,
    google,
    renewToken
}