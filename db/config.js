const mongoose = require('mongoose');


const dbConnection = async()=>{

    try {
        await mongoose.connect(process.env.DB_CNN,
        {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log('dbOnline');

    } catch (error) {
         throw new Error('error a la hora de conectar con la base de datos');   
    }


}

module.exports={
    dbConnection
}