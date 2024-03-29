const {Schema, model} = require('mongoose');

const HospitalSchema = Schema({
    nombre:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    usuario:{
        required: true,
        type: Schema.Types.ObjectId,
        ref :'Usuario'
    }

},{collection: 'hospitales'});

//mostrar solo lo que queremos : tema visual
HospitalSchema.method('toJSON',function(){
    const {__v, ...Object} = this.toObject();
    return Object;
});

module.exports = model('Hospital',HospitalSchema);