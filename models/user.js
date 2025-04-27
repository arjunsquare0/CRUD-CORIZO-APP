const mongoose=require('mongoose');
const { type } = require('os');
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    image:{
        type: string,
        required:true
    },
    created:{
        type: Date,
        required:true,
        default:Date.now
    }
});

module.exports=mongoose.model("user",userSchema);