const { response } = require("express");
const { json } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");


const validarJWT=(req, res = response, next)=>{


    //leer el token
    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
            ok: false,
            msg:'no hay token en la peticion'
        }); 
    }

    try {
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        console.log(uid);   

        req.uid = uid;

    } catch (error) {

         return res.status(401).json({
            ok: false,
            msg:'error en el token'
        });
    }
    next();

}

const validarADMIN_ROLE= async(req, res = response, next)=>{

    const uid= req.uid;
    try {

        const usuarioDB = await Usuario.findById(uid)

        if(!usuarioDB)
        {
            return res.status(404).json({
                ok:false,
                msg:"usuario no existe"
            });
        }
        if(usuarioDB.role!=="ADMIN_ROLE" ){
            return res.status(403).json({
                ok:false,
                msg:"no tiene privilegios para eso"
            });
        }
        next();

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: "hable con el administrador"
        })
    }

}
const validarADMIN_ROLE_o_MismoUsuario= async(req, res = response, next)=>{

    const uid= req.uid;
    const id= req.params.id;
     try {

        const usuarioDB = await Usuario.findById(uid)

        if(!usuarioDB)
        {
            return res.status(404).json({
                ok:false,
                msg:"usuario no existe"
            });
        }
        if(usuarioDB.role!=="ADMIN_ROLE" && uid!==id){
            return res.status(403).json({
                ok:false,
                msg:"no tiene privilegios para eso"
            });
        }
        next();

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: "hable con el administrador"
        })
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,validarADMIN_ROLE_o_MismoUsuario
}
