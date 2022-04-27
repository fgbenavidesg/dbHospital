const { response } = require("express");
const Medico = require("../models/medico");


const getMedicos = async(req , res = response)=>{
    
    const medicos = await Medico.find()
                        .populate('usuario','nombre img')
                        .populate('hospital','nombre img')
                            

    res.json({
        ok: true,
        medicos
    })
    
}
const crearMedicos = async(req , res = response)=>{

    const uid = req.uid;
    const medico = new Medico({usuario: uid, ...req.body} );

    try {

        const medicoDB = await medico.save();


        res.json({
            ok: true,
            medico: medicoDB,
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg:'hable con el administrador'
        })
    }
    
}
const actualizarMedicos = async(req , res = response)=>{
    
    const uid = req.uid;
    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById(id);

        if(!medicoDB){

            return res.status(404).json({
                ok:false,
                msg:'el id de medico no se encontro'
            });

        }

        cambiosMedico ={
            ...req.body,
            usuario: uid
        }
        const medicoActualizado  = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

        res.json({
            ok: true,
            medicoDB : medicoActualizado
        })
        
    } catch (error) {

        res.status(500).json({
            ok: false,
            msg:'hable con el administrador'
        })
    }

}
const BorrarMedicos = (req , res = response)=>{

    
    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById(id);

        if(!medicoDB){

            return res.status(404).json({
                ok:false,
                msg:'el id de medico no se encontro'
            });

        }

         await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg : 'medico eliminado'
        })
        
    } catch (error) {

        res.status(500).json({
            ok: false,
            msg:'hable con el administrador'
        })
    }
    
}
module.exports={
    getMedicos,
    crearMedicos,
    actualizarMedicos,
    BorrarMedicos
}