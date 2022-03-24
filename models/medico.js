const {Schema, model} = require('mongoose');

const MedicoSchema = Schema({
    nombre:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref :'Usuario',
        required: true
    },
    hospital:{
        type: Schema.Types.ObjectId,
        ref:'Hospital',
        required: true

    }

},);

//mostrar solo lo que queremos : tema visual
MedicoSchema.method('toJSON',function(){
    const {__v, ...Object} = this.toObject();
    return Object;
});

module.exports = model('Medico',MedicoSchema);