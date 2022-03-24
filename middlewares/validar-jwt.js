const { response } = require("express");
const { json } = require("express/lib/response");
const jwt = require("jsonwebtoken");


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

module.exports = validarJWT; 