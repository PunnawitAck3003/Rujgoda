const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db')
const cors = require('cors');
const passport = require('passport');
dotenv.config({path:'./config/config.env'});
require('./config/passport'); // Import Passport config

connectDB();

//Route files
const hotels = require('./routes/hotels');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth');
const promotions = require('./routes/promotions');
const favorites = require('./routes/favorites');

const app=express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000", // Specify the frontend's origin
    credentials: true // Allow credentials
}));
app.use(passport.initialize());

app.use('/api/v1/hotels', hotels);
app.use('/api/v1/auth', auth);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/promotions', promotions);
app.use('/api/v1/favorites', favorites);

const PORT=process.env.PORT||5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});