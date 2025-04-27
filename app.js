//import 
require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');
const { existsSync } = require('fs');
const path = require('path');

const app=express();
const PORT=process.env.PORT || 4000;

// server load file static
app.use('/uploads', express.static('uploads'));

// database connnection
mongoose.connect(process.env.DB_URI);
const db=mongoose.connection;
db.on("error",(error)=>{
    console.log(error);
});

db.once("open",()=>console.log('Connected to the database!'));

// middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));

// Flash massage middleware
app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
});

// set template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// route prefix
app.use("",require('./routes/route.js'));

app.listen(PORT,()=>{
    console.log(`Server is running on port number: ${PORT}`);
});