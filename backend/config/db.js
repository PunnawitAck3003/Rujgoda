const mongoose = require('mongoose');
const connectDB = async()=>{
    //mongoose.set('structQuery', true);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    /*
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    */
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;