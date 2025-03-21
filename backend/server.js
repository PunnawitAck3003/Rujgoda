const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db')
const cors = require('cors');

dotenv.config({path:'./config/config.env'});

connectDB();

//Route files
const hospitals = require('./routes/hospitals');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');

const app=express()

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointments);

const PORT=process.env.PORT||5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});